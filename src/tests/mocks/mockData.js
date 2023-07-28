export const mockData = {
    name: "Error Find",
    heading: "This game teaches you to find mistakes in written text.",
    activities: [
      {
        activity_name: "Activity One",
        order: 1,
        questions: [
          {
            is_correct: false,
            stimulus: "I really enjoy *to play football* with friends.",
            order: 1,
            user_answers: [],
            feedback: "I really enjoy *playing football* with friends.",
          },
          {
            is_correct: false,
            stimulus: "My friend *like listening* to songs in English",
            order: 5,
            user_answers: [],
            feedback: "My friend *likes listening* to songs in English",
          },
        ],
      },
      {
        activity_name: "Activity Two",
        order: 2,
        questions: [
          {
            round_title: "Round 1",
            is_correct: false,
            stimulus:
              "Watching films at home is *more cheaper* than at the cinema.",
            order: 1,
            user_answers: [],
            feedback: "Watching films at home is *cheaper* than at the cinema.",
            questions: [
              {
                is_correct: false,
                stimulus:
                  "Watching films at home is *more cheaper* than at the cinema.",
                order: 1,
                user_answers: [],
                feedback:
                  "Watching films at home is *cheaper* than at the cinema.",
              },
              // Additional questions...
            ],
          },
          {
            round_title: "Round 1",
            is_correct: false,
            stimulus:
              "Watching films at home is *more cheaper* than at the cinema.",
            order: 1,
            user_answers: [],
            feedback: "Watching films at home is *cheaper* than at the cinema.",
            questions: [
              {
                is_correct: false,
                stimulus:
                  "Watching films at home is *more cheaper* than at the cinema.",
                order: 1,
                user_answers: [],
                feedback:
                  "Watching films at home is *cheaper* than at the cinema.",
              },
              {
                is_correct: false,
                stimulus:
                  "On the one hand, small cameras are comfortable. *In the other hand*, larger ones take better photos.",
                order: 2,
                user_answers: [],
                feedback:
                  "On the one hand, small cameras are comfortable. *On the other hand*, larger ones take better photos.",
              },
            ],
          },
        ],
      },
    ],
  };