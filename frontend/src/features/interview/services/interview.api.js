import axios from "axios";

const api = axios.create({
    baseURL: "http://localhost:3000",
    withCredentials: true,
    timeout: 15000, // 15s timeout to avoid hanging requests
})

// Deduplicate in-flight GET requests to reduce StrictMode double-mount impact.
let allReportsPromise = null
const reportByIdPromises = new Map()


/**
 * @description Service to generate interview report based on user self description, resume and job description.
 */
export const generateInterviewReport = async ({ jobDescription, selfDescription, resumeFile }) => {

    const formData = new FormData()
    formData.append("jobDescription", jobDescription)
    formData.append("selfDescription", selfDescription)
    formData.append("resume", resumeFile)

    const response = await api.post("/api/interview/", formData, {
        headers: {
            "Content-Type": "multipart/form-data"
        }
    })

    return response.data

}


/**
 * @description Service to get interview report by interviewId.
 */
export const getInterviewReportById = async (interviewId) => {
    const cachedPromise = reportByIdPromises.get(interviewId)
    if (cachedPromise) return cachedPromise

    const promise = (async () => {
        const response = await api.get(`/api/interview/report/${interviewId}`)
        return response.data
    })()

    reportByIdPromises.set(interviewId, promise)

    try {
        return await promise
    } catch (err) {
        console.error('Failed to fetch interview report:', err)
        throw err
    } finally {
        reportByIdPromises.delete(interviewId)
    }
}


/**
 * @description Service to get all interview reports of logged in user.
 */
export const getAllInterviewReports = async () => {
    if (allReportsPromise) return allReportsPromise

    allReportsPromise = (async () => {
        const response = await api.get("/api/interview/")
        return response.data
    })()

    try {
        return await allReportsPromise
    } catch (err) {
        console.error('Failed to fetch interview report list:', err)
        throw err
    } finally {
        allReportsPromise = null
    }
}


/**
 * @description Service to generate resume pdf based on user self description, resume content and job description.
 */
export const generateResumePdf = async ({ interviewReportId }) => {
    try {
        const response = await api.post(`/api/interview/resume/pdf/${interviewReportId}`, null, {
            responseType: "blob"
        })
        return response.data
    } catch (err) {
        console.error('Failed to generate resume PDF:', err)
        throw err
    }
}