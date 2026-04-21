import express from "express";
import Doctor from "../models/doctorModel.js";
import { GoogleGenerativeAI } from "@google/generative-ai";

const aiRouter = express.Router();

// Initialize Gemini
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

// Specialty mappings based on symptoms
const symptomSpecialtyMap = {
  'fever': 'General physician',
  'cold': 'General physician',
  'cough': 'General physician',
  'headache': 'General physician',
  'flu': 'General physician',
  'stomach': 'General physician',
  'skin': 'Dermatologist',
  'rash': 'Dermatologist',
  'acne': 'Dermatologist',
  'hair': 'Dermatologist',
  'pregnancy': 'Gynecologist',
  'period': 'Gynecologist',
  'pregnant': 'Gynecologist',
  'menstruation': 'Gynecologist',
  'women': 'Gynecologist',
  'child': 'Pediatricians',
  'baby': 'Pediatricians',
  'kids': 'Pediatricians',
  'brain': 'Neurologist',
  'head': 'Neurologist',
  'nerve': 'Neurologist',
  'seizure': 'Neurologist',
  'stomach pain': 'Gastroenterologist',
  'digestion': 'Gastroenterologist',
  'liver': 'Gastroenterologist',
  'intestine': 'Gastroenterologist',
  'heart': 'General physician',
  'blood pressure': 'General physician',
  'sugar': 'General physician',
  'diabetes': 'General physician',
  'eye': 'General physician',
  'bones': 'General physician',
  'joint': 'General physician',
  'pain': 'General physician'
};

// Chat function
async function chatWithGemini(message, context = null) {
    try {
        const model = genAI.getGenerativeModel({
            model: "gemini-3-flash-preview",
        });

        let prompt = message;
        if (context) {
            prompt = `Context: ${context}\n\nUser: ${message}`;
        }

        const result = await model.generateContent(prompt);
        const response = await result.response;
        
        return response.text() || "I'm not sure how to respond.";
    } catch (error) {
        console.error("Gemini API Error:", error);
        return "AI service temporarily unavailable. Please try again.";
    }
}

// Find specialty based on symptoms
function findSpecialtyFromSymptoms(symptoms) {
    const lowerSymptoms = symptoms.toLowerCase();
    for (const [keyword, specialty] of Object.entries(symptomSpecialtyMap)) {
        if (lowerSymptoms.includes(keyword)) {
            return specialty;
        }
    }
    return null;
}

// Find doctors by specialty
async function findDoctorsBySpecialty(specialty) {
    try {
        const doctors = await Doctor.find({ available: true, speciality: specialty });
        return doctors;
    } catch (error) {
        console.error("Database Error:", error);
        return [];
    }
}

// Route
aiRouter.post("/chat", async (req, res) => {
    try {
        const { message } = req.body;

        if (!message) {
            return res.status(400).json({ error: "Message is required" });
        }

        const lowerMsg = message.toLowerCase();

        // Check if user is describing symptoms or health issues
        const symptomKeywords = ['pain', 'hurt', 'sick', 'feel', 'have a', 'suffering', 'issue', 'problem', 'not feeling', 'unwell', 'symptom'];
        const hasSymptom = symptomKeywords.some(keyword => lowerMsg.includes(keyword)) || 
                          lowerMsg.includes('problem') ||
                          lowerMsg.includes('issue');

        // Check for doctor queries
        const doctorKeywords = ['available doctors', 'all doctors', 'doctor', 'doctors', 'book', 'appointment'];
        
        if (doctorKeywords.some(keyword => lowerMsg.includes(keyword))) {
            try {
                const doctors = await Doctor.find({ available: true });
                const doctorList = doctors.length > 0 
                    ? doctors.map((doc) => `\n• ${doc.name} - ${doc.speciality} (${doc.experience} years exp)`).join("")
                    : "No doctors available.";
                return res.json({
                    reply: `Available doctors:${doctorList}\n\nWould you like to book an appointment with any of these doctors?`
                });
            } catch (dbError) {
                return res.status(500).json({ error: "Failed to retrieve doctors." });
            }
        }

        // If user describes symptoms, analyze and recommend specialty
        if (hasSymptom || lowerMsg.includes('what') || lowerMsg.includes('which') || lowerMsg.includes('should')) {
            const specialty = findSpecialtyFromSymptoms(lowerMsg);
            
            if (specialty) {
                const doctors = await findDoctorsBySpecialty(specialty);
                
                if (doctors.length > 0) {
                    const doctorList = doctors.map((doc) => `\n• ${doc.name} (${doc.experience} years, ₹${doc.fees})`).join("");
                    return res.json({
                        reply: `Based on your symptoms, I recommend seeing a ${specialty}. Here are available doctors:${doctorList}\n\nWould you like to book an appointment?`
                    });
                } else {
                    return res.json({
                        reply: `Based on your symptoms, I recommend seeing a ${specialty}. Unfortunately, no doctors are currently available in this specialty. Please check back later or contact the hospital directly.`
                    });
                }
            } else {
                // Use AI to analyze symptoms
                const aiReply = await chatWithGemini(`A patient is describing these symptoms: "${message}". 
                    Please suggest what type of doctor/specialty they should consult (e.g., General physician, Dermatologist, Gynecologist, Pediatricians, Neurologist, Gastroenterologist).
                    Keep your response brief and helpful.`);
                return res.json({ reply: aiReply });
            }
        }

        // General AI response
        const aiReply = await chatWithGemini(message);
        res.json({ reply: aiReply });

    } catch (error) {
        console.error("Server Error:", error.message);
        res.status(500).json({ error: "Internal server error" });
    }
});

// Health assessment endpoint
aiRouter.post("/assess", async (req, res) => {
    try {
        const { symptoms, age, gender } = req.body;

        if (!symptoms) {
            return res.status(400).json({ error: "Symptoms are required" });
        }

        // Find matching specialty
        const specialty = findSpecialtyFromSymptoms(symptoms);
        
        if (specialty) {
            const doctors = await findDoctorsBySpecialty(specialty);
            return res.json({
                recommendedSpecialty: specialty,
                doctors: doctors.map(doc => ({
                    name: doc.name,
                    specialty: doc.speciality,
                    experience: doc.experience,
                    fees: doc.fees,
                    available: doc.available
                })),
                message: `Based on your symptoms, we recommend consulting a ${specialty}.`
            });
        } else {
            const aiReply = await chatWithGemini(`Patient symptoms: "${symptoms}". Age: ${age || 'Not specified'}, Gender: ${gender || 'Not specified'}. 
                What specialty of doctor should they consult? List only the specialty name.`);
            return res.json({
                recommendedSpecialty: aiReply.trim(),
                doctors: [],
                message: "We couldn't find a specific match. Please consult our General Physician for initial assessment."
            });
        }

    } catch (error) {
        console.error("Assessment Error:", error.message);
        res.status(500).json({ error: "Internal server error" });
    }
});

export default aiRouter;