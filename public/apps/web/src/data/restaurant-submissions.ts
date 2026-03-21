export type SubmissionStatus = 'pending' | 'approved' | 'rejected'

export interface RestaurantSubmission {
  id: string
  submittedBy: string        // userId
  ownerName: string
  ownerEmail: string
  ownerPhone: string
  name: string
  description: string
  cuisine: string
  address: string
  categories: string[]
  imageUrl: string
  status: SubmissionStatus
  adminNote: string
  submittedAt: string
  reviewedAt: string | null
}

export const submissions: RestaurantSubmission[] = []

let nextId = 1
export function getNextSubmissionId(): string {
  return `sub${nextId++}`
}
