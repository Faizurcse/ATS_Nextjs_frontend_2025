"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Checkbox } from "@/components/ui/checkbox"
import {
  Building2,
  MapPin,
  DollarSign,
  Clock,
  Upload,
  FileText,
  CheckCircle,
  AlertCircle,
  Briefcase,
  Globe,
} from "lucide-react"
import { formatSalary, JOB_TYPES, COUNTRIES } from "../../../lib/location-data"

interface JobPosting {
  id: string
  title: string
  company: string
  location: string
  country: string
  city: string
  jobType: string
  salaryMin: number
  salaryMax: number
  description: string
  requirements: string[]
  skills: string[]
  experience: string
  status: string
  priority: string
  postedDate: string
  lastUpdated: string
  applicants: number
  views: number
  internalSPOC: string
  recruiter: string
  department: string
  employmentType: string
  remote: boolean
  benefits: string[]
  customQuestions?: Array<{
    id: string
    question: string
    type: "text" | "select" | "number" | "boolean"
    required: boolean
    options?: string[]
  }>
}

interface ApplicationData {
  firstName: string
  lastName: string
  email: string
  phone: string
  currentLocation: string
  resumeFile: File | null
  coverLetter: string
  customAnswers: Record<string, any>
  source: string
  utmSource: string
  utmMedium: string
  utmCampaign: string
}

export default function ApplyJobPage() {
  const params = useParams()
  const router = useRouter()
  const jobId = params.jobId as string

  const [job, setJob] = useState<JobPosting | null>(null)
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const [error, setError] = useState("")

  const [applicationData, setApplicationData] = useState<ApplicationData>({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    currentLocation: "",
    resumeFile: null,
    coverLetter: "",
    customAnswers: {},
    source: "social-media",
    utmSource: "",
    utmMedium: "",
    utmCampaign: "",
  })

  // Mock job data - in real app this would come from API
  const mockJobs: JobPosting[] = [
    {
      id: "1",
      title: "Senior Software Engineer",
      company: "TechCorp Inc.",
      location: "San Francisco, CA",
      country: "US",
      city: "San Francisco",
      jobType: "full-time",
      salaryMin: 120000,
      salaryMax: 180000,
      description:
        "We are looking for a Senior Software Engineer to join our growing team. You will be responsible for designing, developing, and maintaining scalable web applications using modern technologies.",
      requirements: [
        "Bachelor's degree in Computer Science or related field",
        "5+ years of software development experience",
        "Strong proficiency in React and Node.js",
        "Experience with cloud platforms (AWS, GCP, or Azure)",
        "Excellent problem-solving and communication skills",
      ],
      skills: ["React", "Node.js", "TypeScript", "AWS", "PostgreSQL", "Docker"],
      experience: "5+ years",
      status: "active",
      priority: "high",
      postedDate: "2024-01-10",
      lastUpdated: "2024-01-15",
      applicants: 12,
      views: 156,
      internalSPOC: "Sarah Wilson",
      recruiter: "Sarah Wilson",
      department: "Engineering",
      employmentType: "Full-time",
      remote: true,
      benefits: ["Health Insurance", "401k", "Flexible PTO", "Remote Work", "Stock Options"],
      customQuestions: [
        {
          id: "skills",
          question: "What are your key skills relevant to Senior Software Engineer?",
          type: "text",
          required: true,
        },
        {
          id: "location",
          question: "What is your current location?",
          type: "text",
          required: true,
        },
        {
          id: "salary",
          question: "What is your current salary expectation for this full-time position?",
          type: "number",
          required: true,
        },
        {
          id: "notice",
          question: "What is your notice period?",
          type: "select",
          required: true,
          options: ["Immediate", "2 weeks", "1 month", "2 months", "3 months"],
        },
        {
          id: "experience",
          question: "How many years of experience do you have in senior software engineer roles?",
          type: "select",
          required: true,
          options: ["0-1 years", "2-3 years", "4-5 years", "6-10 years", "10+ years"],
        },
        {
          id: "remote",
          question: "Are you open to remote work?",
          type: "boolean",
          required: false,
        },
        {
          id: "availability",
          question: "When can you start?",
          type: "select",
          required: true,
          options: ["Immediately", "Within 2 weeks", "Within 1 month", "Within 2 months", "More than 2 months"],
        },
        {
          id: "portfolio",
          question: "Please provide a link to your portfolio or GitHub profile",
          type: "text",
          required: false,
        },
      ],
    },
  ]

  useEffect(() => {
    // Extract UTM parameters from URL
    const urlParams = new URLSearchParams(window.location.search)
    const utmSource = urlParams.get("utm_source") || ""
    const utmMedium = urlParams.get("utm_medium") || ""
    const utmCampaign = urlParams.get("utm_campaign") || ""

    setApplicationData((prev) => ({
      ...prev,
      utmSource,
      utmMedium,
      utmCampaign,
    }))

    // Simulate API call to fetch job details
    setTimeout(() => {
      const foundJob = mockJobs.find((j) => j.id === jobId)
      if (foundJob) {
        setJob(foundJob)
        // Initialize custom answers
        const initialAnswers: Record<string, any> = {}
        foundJob.customQuestions?.forEach((q) => {
          initialAnswers[q.id] = q.type === "boolean" ? false : ""
        })
        setApplicationData((prev) => ({
          ...prev,
          customAnswers: initialAnswers,
        }))
      } else {
        setError("Job not found")
      }
      setLoading(false)
    }, 1000)
  }, [jobId])

  const handleInputChange = (field: keyof ApplicationData, value: any) => {
    setApplicationData((prev) => ({
      ...prev,
      [field]: value,
    }))
  }

  const handleCustomAnswerChange = (questionId: string, value: any) => {
    setApplicationData((prev) => ({
      ...prev,
      customAnswers: {
        ...prev.customAnswers,
        [questionId]: value,
      },
    }))
  }

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      // Validate file type and size
      const allowedTypes = [
        "application/pdf",
        "application/msword",
        "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
      ]
      const maxSize = 5 * 1024 * 1024 // 5MB

      if (!allowedTypes.includes(file.type)) {
        setError("Please upload a PDF or Word document")
        return
      }

      if (file.size > maxSize) {
        setError("File size must be less than 5MB")
        return
      }

      setApplicationData((prev) => ({
        ...prev,
        resumeFile: file,
      }))
      setError("")
    }
  }

  const validateForm = () => {
    if (!applicationData.firstName.trim()) return "First name is required"
    if (!applicationData.lastName.trim()) return "Last name is required"
    if (!applicationData.email.trim()) return "Email is required"
    if (!applicationData.phone.trim()) return "Phone number is required"
    if (!applicationData.resumeFile) return "Resume is required"

    // Validate custom questions
    if (job?.customQuestions) {
      for (const question of job.customQuestions) {
        if (question.required) {
          const answer = applicationData.customAnswers[question.id]
          if (!answer || (typeof answer === "string" && !answer.trim())) {
            return `Please answer: ${question.question}`
          }
        }
      }
    }

    return null
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    const validationError = validateForm()
    if (validationError) {
      setError(validationError)
      return
    }

    setSubmitting(true)
    setError("")

    try {
      // Simulate API call to submit application
      await new Promise((resolve) => setTimeout(resolve, 2000))

      // In real app, this would send data to your backend
      const applicationPayload = {
        jobId,
        ...applicationData,
        appliedAt: new Date().toISOString(),
        source: "social-media",
        status: "new",
      }

      console.log("Application submitted:", applicationPayload)
      setSubmitted(true)
    } catch (err) {
      setError("Failed to submit application. Please try again.")
    } finally {
      setSubmitting(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading job details...</p>
        </div>
      </div>
    )
  }

  if (error && !job) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Card className="w-full max-w-md">
          <CardContent className="p-6 text-center">
            <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
            <h2 className="text-xl font-semibold text-gray-900 mb-2">Job Not Found</h2>
            <p className="text-gray-600 mb-4">The job you're looking for doesn't exist or has been removed.</p>
            <Button onClick={() => router.push("/")} className="bg-blue-600 hover:bg-blue-700">
              Back to Jobs
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  if (submitted) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Card className="w-full max-w-md">
          <CardContent className="p-6 text-center">
            <CheckCircle className="w-12 h-12 text-green-500 mx-auto mb-4" />
            <h2 className="text-xl font-semibold text-gray-900 mb-2">Application Submitted!</h2>
            <p className="text-gray-600 mb-4">
              Thank you for applying to {job?.title} at {job?.company}. We'll review your application and get back to
              you soon.
            </p>
            <div className="space-y-2 text-sm text-gray-500">
              <p>Application ID: APP-{Date.now()}</p>
              <p>Submitted: {new Date().toLocaleDateString()}</p>
            </div>
            <Button onClick={() => router.push("/")} className="bg-blue-600 hover:bg-blue-700 mt-4">
              View More Jobs
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  if (!job) return null

  const jobTypeInfo = JOB_TYPES.find((type) => type.value === job.jobType)
  const countryInfo = COUNTRIES.find((country) => country.code === job.country)

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Job Header */}
        <Card className="mb-8">
          <CardContent className="p-6">
            <div className="flex items-start justify-between mb-4">
              <div className="flex-1">
                <h1 className="text-2xl font-bold text-gray-900 mb-2">{job.title}</h1>
                <div className="flex items-center space-x-4 text-sm text-gray-600 mb-3">
                  <div className="flex items-center space-x-1">
                    <Building2 className="w-4 h-4" />
                    <span>{job.company}</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <MapPin className="w-4 h-4" />
                    <span>{job.location}</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <Briefcase className="w-4 h-4" />
                    <span>{jobTypeInfo?.label}</span>
                  </div>
                  {job.remote && (
                    <div className="flex items-center space-x-1">
                      <Globe className="w-4 h-4" />
                      <span>Remote</span>
                    </div>
                  )}
                </div>
                <div className="flex items-center space-x-4 text-sm text-gray-600">
                  <div className="flex items-center space-x-1">
                    <DollarSign className="w-4 h-4" />
                    <span>
                      {formatSalary(job.salaryMin, job.jobType, job.country, true, job.salaryMin)} -{" "}
                      {formatSalary(job.salaryMax, job.jobType, job.country)}
                    </span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <Clock className="w-4 h-4" />
                    <span>{job.experience}</span>
                  </div>
                </div>
              </div>
              <div className="flex flex-col space-y-2">
                <Badge className="bg-green-100 text-green-800">{job.status}</Badge>
                <Badge variant="outline">{job.priority} priority</Badge>
              </div>
            </div>

            <div className="mb-4">
              <h3 className="font-semibold text-gray-900 mb-2">About this role</h3>
              <p className="text-gray-700 text-sm">{job.description}</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h4 className="font-semibold text-gray-900 mb-2">Requirements</h4>
                <ul className="text-sm text-gray-700 space-y-1">
                  {job.requirements.map((req, index) => (
                    <li key={index} className="flex items-start space-x-2">
                      <span className="text-blue-600 mt-1">•</span>
                      <span>{req}</span>
                    </li>
                  ))}
                </ul>
              </div>
              <div>
                <h4 className="font-semibold text-gray-900 mb-2">Skills</h4>
                <div className="flex flex-wrap gap-2">
                  {job.skills.map((skill, index) => (
                    <Badge key={index} variant="outline" className="text-xs">
                      {skill}
                    </Badge>
                  ))}
                </div>
              </div>
            </div>

            {job.benefits.length > 0 && (
              <div className="mt-6">
                <h4 className="font-semibold text-gray-900 mb-2">Benefits</h4>
                <div className="flex flex-wrap gap-2">
                  {job.benefits.map((benefit, index) => (
                    <Badge key={index} variant="outline" className="text-xs bg-blue-50 text-blue-700">
                      {benefit}
                    </Badge>
                  ))}
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Application Form */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <FileText className="w-5 h-5" />
              <span>Apply for this position</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Basic Information */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-gray-900">Personal Information</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="firstName">First Name *</Label>
                    <Input
                      id="firstName"
                      value={applicationData.firstName}
                      onChange={(e) => handleInputChange("firstName", e.target.value)}
                      placeholder="John"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="lastName">Last Name *</Label>
                    <Input
                      id="lastName"
                      value={applicationData.lastName}
                      onChange={(e) => handleInputChange("lastName", e.target.value)}
                      placeholder="Smith"
                      required
                    />
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="email">Email Address *</Label>
                    <Input
                      id="email"
                      type="email"
                      value={applicationData.email}
                      onChange={(e) => handleInputChange("email", e.target.value)}
                      placeholder="john.smith@email.com"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="phone">Phone Number *</Label>
                    <Input
                      id="phone"
                      value={applicationData.phone}
                      onChange={(e) => handleInputChange("phone", e.target.value)}
                      placeholder="+1 (555) 123-4567"
                      required
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="currentLocation">Current Location</Label>
                  <Input
                    id="currentLocation"
                    value={applicationData.currentLocation}
                    onChange={(e) => handleInputChange("currentLocation", e.target.value)}
                    placeholder="San Francisco, CA"
                  />
                </div>
              </div>

              {/* Resume Upload */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-gray-900">Resume & Cover Letter</h3>
                <div className="space-y-2">
                  <Label htmlFor="resume">Resume *</Label>
                  <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-gray-400 transition-colors">
                    <Upload className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                    <div className="space-y-2">
                      <p className="text-sm text-gray-600">
                        {applicationData.resumeFile ? applicationData.resumeFile.name : "Upload your resume"}
                      </p>
                      <p className="text-xs text-gray-500">PDF, DOC, or DOCX (max 5MB)</p>
                      <input
                        type="file"
                        id="resume"
                        accept=".pdf,.doc,.docx"
                        onChange={handleFileUpload}
                        className="hidden"
                      />
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => document.getElementById("resume")?.click()}
                        className="mt-2"
                      >
                        Choose File
                      </Button>
                    </div>
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="coverLetter">Cover Letter (Optional)</Label>
                  <Textarea
                    id="coverLetter"
                    value={applicationData.coverLetter}
                    onChange={(e) => handleInputChange("coverLetter", e.target.value)}
                    placeholder="Tell us why you're interested in this position..."
                    rows={4}
                  />
                </div>
              </div>

              {/* Custom Questions */}
              {job.customQuestions && job.customQuestions.length > 0 && (
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-gray-900">Additional Questions</h3>
                  <div className="space-y-4">
                    {job.customQuestions.map((question, index) => (
                      <div key={question.id} className="space-y-2">
                        <Label htmlFor={question.id}>
                          Q{index + 1}. {question.question}
                          {question.required && <span className="text-red-500 ml-1">*</span>}
                        </Label>

                        {question.type === "text" && (
                          <Input
                            id={question.id}
                            value={applicationData.customAnswers[question.id] || ""}
                            onChange={(e) => handleCustomAnswerChange(question.id, e.target.value)}
                            placeholder="Your answer..."
                            required={question.required}
                          />
                        )}

                        {question.type === "number" && (
                          <Input
                            id={question.id}
                            type="number"
                            value={applicationData.customAnswers[question.id] || ""}
                            onChange={(e) => handleCustomAnswerChange(question.id, e.target.value)}
                            placeholder="Enter amount..."
                            required={question.required}
                          />
                        )}

                        {question.type === "select" && question.options && (
                          <Select
                            value={applicationData.customAnswers[question.id] || ""}
                            onValueChange={(value) => handleCustomAnswerChange(question.id, value)}
                          >
                            <SelectTrigger>
                              <SelectValue placeholder="Select an option..." />
                            </SelectTrigger>
                            <SelectContent>
                              {question.options.map((option) => (
                                <SelectItem key={option} value={option}>
                                  {option}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        )}

                        {question.type === "boolean" && (
                          <div className="flex items-center space-x-2">
                            <Checkbox
                              id={question.id}
                              checked={applicationData.customAnswers[question.id] || false}
                              onCheckedChange={(checked) => handleCustomAnswerChange(question.id, checked)}
                            />
                            <Label htmlFor={question.id} className="text-sm font-normal">
                              Yes
                            </Label>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Error Message */}
              {error && (
                <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                  <div className="flex items-center space-x-2">
                    <AlertCircle className="w-5 h-5 text-red-500" />
                    <p className="text-red-700 text-sm">{error}</p>
                  </div>
                </div>
              )}

              {/* Submit Button */}
              <div className="flex justify-end space-x-4">
                <Button type="button" variant="outline" onClick={() => router.back()} disabled={submitting}>
                  Cancel
                </Button>
                <Button type="submit" disabled={submitting} className="bg-blue-600 hover:bg-blue-700 min-w-[120px]">
                  {submitting ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                      Submitting...
                    </>
                  ) : (
                    "Submit Application"
                  )}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>

        {/* Source Tracking Info */}
        {applicationData.utmSource && (
          <Card className="mt-4">
            <CardContent className="p-4">
              <div className="text-xs text-gray-500">
                <p>Application source: {applicationData.utmSource}</p>
                {applicationData.utmMedium && <p>Medium: {applicationData.utmMedium}</p>}
                {applicationData.utmCampaign && <p>Campaign: {applicationData.utmCampaign}</p>}
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}
