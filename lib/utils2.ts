export const formatDate = (dateString: string): string => {
    const date = new Date(dateString)
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    })
  }
  
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  export function cn(...inputs: any[]) {
    return inputs.filter(Boolean).join(" ")
  }
  