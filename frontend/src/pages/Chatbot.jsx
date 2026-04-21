import React, { useState, useEffect, useRef, useContext } from "react";
import SpeechRecognition, { useSpeechRecognition } from "react-speech-recognition";
import { useNavigate } from "react-router-dom";
import { AppContext } from "../context/AppContext";

const ChatComponent = () => {
    const context = useContext(AppContext);
    const backendUrl = context?.backendUrl || 'http://localhost:4000';
    const [message, setMessage] = useState("");
    const [reply, setReply] = useState(null);
    const [loading, setLoading] = useState(false);
    const [isOpen, setIsOpen] = useState(false);
    const [chatHistory, setChatHistory] = useState([]);
    const [showSymptomChecker, setShowSymptomChecker] = useState(false);
    const [symptoms, setSymptoms] = useState("");
    const [assessmentResult, setAssessmentResult] = useState(null);
    const chatRef = useRef(null);
    const navigate = useNavigate();
    const { transcript, listening, resetTranscript } = useSpeechRecognition();

    useEffect(() => {
        if (transcript) {
            setMessage(transcript);
        }
    }, [transcript]);

    useEffect(() => {
        if (chatRef.current) {
            chatRef.current.scrollTop = chatRef.current.scrollHeight;
        }
    }, [chatHistory]);

    const handleSend = async (customMessage = null) => {
        const userMessage = customMessage || message;
        if (!userMessage.trim()) return;

        setLoading(true);
        
        setChatHistory(prev => [...prev, { type: 'user', text: userMessage }]);
        setReply(null);

        try {
            const res = await fetch(`${backendUrl}/api/chat`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ message: userMessage }),
            });

            const data = await res.json();
            setReply(data.reply);
            setChatHistory(prev => [...prev, { type: 'bot', text: data.reply }]);
        } catch (error) {
            console.error("Error:", error);
            const errorMsg = "Failed to fetch response. Please try again.";
            setReply(errorMsg);
            setChatHistory(prev => [...prev, { type: 'bot', text: errorMsg }]);
        } finally {
            setLoading(false);
            if (!customMessage) {
                setMessage("");
                resetTranscript();
            }
        }
    };

    const handleSymptomAssessment = async () => {
        if (!symptoms.trim()) return;

        setLoading(true);
        try {
            const res = await fetch(`${backendUrl}/api/chat`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ message: `I have the following symptoms: ${symptoms}. What type of doctor should I consult?` }),
            });

            const data = await res.json();
            setChatHistory(prev => [
                ...prev,
                { type: 'user', text: symptoms },
                { type: 'bot', text: data.reply }
            ]);
            setAssessmentResult(data.reply);
            setShowSymptomChecker(false);
            setSymptoms("");
        } catch (error) {
            console.error("Error:", error);
        } finally {
            setLoading(false);
        }
    };

    const handleKeyPress = (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSend();
        }
    };

    const handleDoctorClick = (specialty) => {
        setIsOpen(false);
        navigate(`/doctors/${specialty.toLowerCase().replace(/ /g, '-')}`);
    };

    const quickQuestions = [
        "I have a fever and headache",
        "I need a skin doctor",
        "I want to see a gynecologist",
        "My child is sick",
        "I have stomach pain"
    ];

    return (
        <>
            {/* Floating Button */}
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="fixed bottom-6 right-6 w-16 h-16 bg-primary rounded-full shadow-2xl flex items-center justify-center text-2xl z-50 hover:scale-110 hover:rotate-12 transition-all duration-300"
            >
                💬
            </button>

            {/* Chat Window */}
            {isOpen && (
                <div className="fixed bottom-24 right-6 w-80 sm:w-96 h-[500px] bg-white rounded-2xl shadow-2xl z-50 flex flex-col overflow-hidden border border-gray-200">
                    {/* Header */}
                    <div className="bg-primary px-5 py-4 flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
                                <span className="text-xl">🤖</span>
                            </div>
                            <div>
                                <h3 className="text-white font-semibold">MediCore AI</h3>
                                <p className="text-white/70 text-xs">Health Assistant</p>
                            </div>
                        </div>
                        <button onClick={() => setIsOpen(false)} className="text-white hover:bg-white/20 p-2 rounded-lg transition-colors">
                            ✕
                        </button>
                    </div>

                    {/* Chat Messages */}
                    <div ref={chatRef} className="flex-1 overflow-y-auto p-4 space-y-3 bg-gray-50">
                        {chatHistory.length === 0 && !showSymptomChecker && (
                            <div className="text-center py-4">
                                <div className="text-4xl mb-3">👋</div>
                                <p className="text-gray-500 font-medium">Hello! How can I help you today?</p>
                                <p className="text-gray-400 text-sm mt-1 mb-4">Describe your symptoms or ask about doctors</p>
                                
                                {/* Quick Actions */}
                                <div className="space-y-2">
                                    <button
                                        onClick={() => setShowSymptomChecker(true)}
                                        className="w-full bg-green-50 text-green-700 px-4 py-2.5 rounded-xl text-sm font-medium hover:bg-green-100 transition-colors flex items-center justify-center gap-2"
                                    >
                                        🩺 Describe Your Symptoms
                                    </button>
                                    <button
                                        onClick={() => handleSend("Show me available doctors")}
                                        className="w-full bg-blue-50 text-blue-700 px-4 py-2.5 rounded-xl text-sm font-medium hover:bg-blue-100 transition-colors flex items-center justify-center gap-2"
                                    >
                                        👨‍⚕️ Find a Doctor
                                    </button>
                                </div>

                                {/* Quick Questions */}
                                <div className="mt-4 pt-4 border-t border-gray-200">
                                    <p className="text-xs text-gray-400 mb-2">Try asking:</p>
                                    <div className="space-y-1">
                                        {quickQuestions.map((q, i) => (
                                            <button
                                                key={i}
                                                onClick={() => handleSend(q)}
                                                className="text-xs text-gray-500 hover:text-primary hover:underline block w-full text-left"
                                            >
                                                • {q}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Symptom Checker */}
                        {showSymptomChecker && (
                            <div className="bg-white rounded-xl p-4 shadow-sm">
                                <div className="flex items-center justify-between mb-3">
                                    <h4 className="font-semibold text-gray-800">🩺 Symptom Checker</h4>
                                    <button onClick={() => setShowSymptomChecker(false)} className="text-gray-400 hover:text-gray-600">✕</button>
                                </div>
                                <p className="text-sm text-gray-600 mb-3">Describe your symptoms or health issue:</p>
                                <textarea
                                    value={symptoms}
                                    onChange={(e) => setSymptoms(e.target.value)}
                                    placeholder="e.g., I have fever, headache, and sore throat..."
                                    className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-primary h-24 resize-none"
                                />
                                <button
                                    onClick={handleSymptomAssessment}
                                    disabled={loading || !symptoms.trim()}
                                    className="w-full mt-3 bg-primary text-white py-2.5 rounded-lg text-sm font-medium hover:bg-blue-700 disabled:opacity-50 transition-colors"
                                >
                                    {loading ? 'Analyzing...' : 'Get Recommendation'}
                                </button>
                            </div>
                        )}

                        {chatHistory.map((msg, index) => (
                            <div key={index} className={`flex ${msg.type === 'user' ? 'justify-end' : 'justify-start'}`}>
                                <div className={`max-w-[85%] p-3 rounded-2xl text-sm ${msg.type === 'user' ? 'bg-primary text-white rounded-br-md' : 'bg-white border border-gray-200 text-gray-700 rounded-bl-md'}`}>
                                    {msg.text}
                                </div>
                            </div>
                        ))}
                        {loading && (
                            <div className="flex justify-start">
                                <div className="bg-white border border-gray-200 p-3 rounded-2xl rounded-bl-md">
                                    <div className="flex gap-1">
                                        <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></span>
                                        <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></span>
                                        <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></span>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Input Area */}
                    <div className="p-3 bg-white border-t border-gray-200">
                        <div className="flex gap-2">
                            <button
                                onClick={() => setShowSymptomChecker(!showSymptomChecker)}
                                className="w-10 h-10 bg-green-100 text-green-600 rounded-full flex items-center justify-center hover:bg-green-200 transition-colors"
                                title="Symptom Checker"
                            >
                                🩺
                            </button>
                            <input
                                value={message}
                                onChange={(e) => setMessage(e.target.value)}
                                onKeyPress={handleKeyPress}
                                placeholder="Type a message..."
                                className="flex-1 px-4 py-2 border border-gray-200 rounded-full text-sm focus:outline-none focus:border-primary"
                            />
                            <button
                                onClick={() => handleSend()}
                                disabled={loading || !message.trim()}
                                className="w-10 h-10 bg-primary rounded-full flex items-center justify-center text-white hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                            >
                                ➤
                            </button>
                        </div>
                        <div className="flex justify-center mt-2">
                            <button
                                onClick={SpeechRecognition.startListening}
                                className={`px-3 py-1 text-xs rounded-full ${listening ? 'bg-red-100 text-red-600 animate-pulse' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'} transition-colors`}
                            >
                                🎤 {listening ? 'Listening...' : 'Voice'}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
};

export default ChatComponent;
