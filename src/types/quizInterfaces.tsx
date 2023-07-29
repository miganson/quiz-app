// Update your types to reflect the actual structure
 
  export interface QuizData {
    name: string;
    heading: string;
    activities: Activity[];
  }
  
  export type QuizProps = {
    data: QuizData;
  };

  export type Activity = {
    activity_name: string;
    order: number;
    questions: (Question | NestedQuestion)[];
  };
  
  export type Question = {
    is_correct: boolean;
    stimulus: string;
    order: number;
    user_answers: string[];
    feedback: string;
  };
  
  export type NestedQuestion = Question & {
    round_title: string;
    questions: Question[];
  };

  export interface UserResponse {
    is_correct: boolean;
    question: string;
    roundTitle: string;
  }

  export interface HomeProps {
    data: QuizData | null;
  }