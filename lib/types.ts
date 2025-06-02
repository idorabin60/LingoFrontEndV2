/* eslint-disable @typescript-eslint/no-explicit-any */
export interface GrammaticalPhenomenon {
    id: number
    text: string
    homework: number
  }
  
  export interface FillInBlank {
    id: number
    sentence: string,
    hebrew_sentence: string,
    options: string[]
    correct_option: string
    homework: number
  }
  
  export interface VocabMatch {
    id: number
    arabic_word: string
    hebrew_word: string
    homework: number
  }
  
  export interface Homework {
    id: number
    due_date: string
    vocab_matches: VocabMatch[]
    fill_in_blanks: FillInBlank[]
    grammatical_phenomenon: GrammaticalPhenomenon
  }
  export type ToolHandler = (args: any) => Promise<any>;
