const { GoogleGenAI } = require("@google/genai")
const { z } = require("zod")
const { zodToJsonSchema } = require("zod-to-json-schema")

const ai = new GoogleGenAI({
    apiKey: process.env.GOOGLE_GENAI_API_KEY
})

async function invokeAI() {
    const response = await ai.models.generateContent({
        model: "gemini-2.5-flash",
        contents: "Hello Gemini, tell me how to prepare for a software engineering interview at Google? in a month time frame. I have 3 years of experience in software development and I am proficient in JavaScript and Python. I have experience working on web applications and have a good understanding of data structures and algorithms." 
    })

    console.log(response.text)
}

const interviewReportSchema = z.object({
    matchScore: z.number().describe("A score representing how well the candidate matches the job requirements, on a scale of 0 to 100"),
    technicalQuestions: z.array(z.object({
        question: z.string().describe("The technical question that can be asked during the interview"),
        intention: z.string().describe("The intention behind asking this question"),
        answer: z.string().describe("How to answer this question , what points to cover, what approach can we take to answer this question")
    })).describe("A list of technical questions that can be asked during the interview"),
    behavioralQuestions: z.array(z.object({
        question: z.string().describe("The behavioral question that can be asked during the interview"),
        intention: z.string().describe("The intention behind asking this question"),
        answer: z.string().describe("How to answer this question , what points to cover, what approach can we take to answer this question")
    })).describe("A list of behavioral questions that can be asked during the interview"),
    skillGaps: z.array(z.object({
        skill: z.string().describe("The skill which candidate is lacking"),
        severity: z.enum(["low", "medium", "high"]).describe("The severity of the skill gap")  
    }).describe("list of skill gaps in the candidate profile along with the severity of the gap")), 
    preparationPlan: z.array(z.object({
        day: z.number().describe("The day number in the preparation plan"),
        focus: z.string().describe("The main focus of the preparation for that day"),
        tasks: z.array(z.string()).describe("The list of tasks to be completed on that day for preparation")
    })).describe("A detailed preparation plan for the candidate to prepare for the interview in a month time frame") ,
    title: z.string().describe("The title of the position the candidate is applying for")
})

async function generateInterviewReport ({resume, selfDescription, jobDescription}) {

        const prompt = `
            You are an expert technical interviewer.

            Return ONLY valid JSON. No explanation, no extra text.

            STRICT FORMAT (FOLLOW EXACTLY):

            {
            "matchScore": number,
            "technicalQuestions": [
                {
                "question": "string",
                "intention": "string",
                "answer": "string"
                }
            ],
            "behavioralQuestions": [
                {
                "question": "string",
                "intention": "string",
                "answer": "string"
                }
            ],
            "skillGaps": [
                {
                "skill": "string",
                "severity": "low | medium | high"
                }
            ],
            "preparationPlan": [
                {
                "day": number,
                "focus": "string",
                "tasks": ["string"]
                }
            ]
            }

            RULES:
            - DO NOT return interview_report
            - DO NOT return nested objects
            - DO NOT return arrays as strings
            - Generate at least:
            - 5 technicalQuestions
            - 3 behavioralQuestions
            - 3 skillGaps
            - 7 preparationPlan

            DATA:
            Resume: ${resume}
            Self Description: ${selfDescription}
            Job Description: ${jobDescription}
            `   

    const response = await ai.models.generateContent({
        model: "gemini-3-flash-preview",
        contents: prompt,
        config : {
            responseMimeType: "application/json", 
        }
    })

    const raw = response.text;
    console.log("RAW:", raw);

    const data = JSON.parse(raw);
    return data;

}

module.exports = generateInterviewReport

