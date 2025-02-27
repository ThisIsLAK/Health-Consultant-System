export const testsData = [
    {
        id: "gad7",
        title: "Generalised anxiety disorder assessment (GAD-7)",
        description: "Severity measures for Generalised Anxiety Disorder (GAD)",
        longDescription: "The GAD-7 is a self-reported questionnaire for screening and measuring the severity of generalized anxiety disorder. This assessment evaluates how often you've been bothered by specific problems over the past two weeks.",
        duration: "2-3 minutes",
        maxScore: 21,
        questions: [
            {
                text: "Feeling nervous, anxious, or on edge",
                options: [
                    { text: "Not at all", value: "0" },
                    { text: "Several days", value: "1" },
                    { text: "More than half the days", value: "2" },
                    { text: "Nearly every day", value: "3" }
                ]
            },
            {
                text: "Not being able to stop or control worrying",
                options: [
                    { text: "Not at all", value: "0" },
                    { text: "Several days", value: "1" },
                    { text: "More than half the days", value: "2" },
                    { text: "Nearly every day", value: "3" }
                ]
            },
            {
                text: "Worrying too much about different things",
                options: [
                    { text: "Not at all", value: "0" },
                    { text: "Several days", value: "1" },
                    { text: "More than half the days", value: "2" },
                    { text: "Nearly every day", value: "3" }
                ]
            },
            {
                text: "Trouble relaxing",
                options: [
                    { text: "Not at all", value: "0" },
                    { text: "Several days", value: "1" },
                    { text: "More than half the days", value: "2" },
                    { text: "Nearly every day", value: "3" }
                ]
            },
            {
                text: "Being so restless that it's hard to sit still",
                options: [
                    { text: "Not at all", value: "0" },
                    { text: "Several days", value: "1" },
                    { text: "More than half the days", value: "2" },
                    { text: "Nearly every day", value: "3" }
                ]
            },
            {
                text: "Becoming easily annoyed or irritable",
                options: [
                    { text: "Not at all", value: "0" },
                    { text: "Several days", value: "1" },
                    { text: "More than half the days", value: "2" },
                    { text: "Nearly every day", value: "3" }
                ]
            },
            {
                text: "Feeling afraid as if something awful might happen",
                options: [
                    { text: "Not at all", value: "0" },
                    { text: "Several days", value: "1" },
                    { text: "More than half the days", value: "2" },
                    { text: "Nearly every day", value: "3" }
                ]
            }
        ]
    },
    {
        id: "phq9",
        title: "Patient health questionnaire (PHQ-9)",
        description: "Objectifies degree of depression severity",
        longDescription: "The PHQ-9 is a multipurpose instrument for screening, diagnosing, monitoring and measuring the severity of depression. This assessment measures how often you've been bothered by specific problems over the past two weeks.",
        duration: "3-5 minutes",
        maxScore: 27,
        questions: [
            {
                text: "Little interest or pleasure in doing things",
                options: [
                    { text: "Not at all", value: "0" },
                    { text: "Several days", value: "1" },
                    { text: "More than half the days", value: "2" },
                    { text: "Nearly every day", value: "3" }
                ]
            },
            {
                text: "Feeling down, depressed, or hopeless",
                options: [
                    { text: "Not at all", value: "0" },
                    { text: "Several days", value: "1" },
                    { text: "More than half the days", value: "2" },
                    { text: "Nearly every day", value: "3" }
                ]
            },
            {
                text: "Trouble falling or staying asleep, or sleeping too much",
                options: [
                    { text: "Not at all", value: "0" },
                    { text: "Several days", value: "1" },
                    { text: "More than half the days", value: "2" },
                    { text: "Nearly every day", value: "3" }
                ]
            },
            {
                text: "Feeling tired or having little energy",
                options: [
                    { text: "Not at all", value: "0" },
                    { text: "Several days", value: "1" },
                    { text: "More than half the days", value: "2" },
                    { text: "Nearly every day", value: "3" }
                ]
            },
            {
                text: "Poor appetite or overeating",
                options: [
                    { text: "Not at all", value: "0" },
                    { text: "Several days", value: "1" },
                    { text: "More than half the days", value: "2" },
                    { text: "Nearly every day", value: "3" }
                ]
            },
            {
                text: "Feeling bad about yourself - or that you are a failure or have let yourself or your family down",
                options: [
                    { text: "Not at all", value: "0" },
                    { text: "Several days", value: "1" },
                    { text: "More than half the days", value: "2" },
                    { text: "Nearly every day", value: "3" }
                ]
            },
            {
                text: "Trouble concentrating on things, such as reading the newspaper or watching television",
                options: [
                    { text: "Not at all", value: "0" },
                    { text: "Several days", value: "1" },
                    { text: "More than half the days", value: "2" },
                    { text: "Nearly every day", value: "3" }
                ]
            },
            {
                text: "Moving or speaking so slowly that other people could have noticed? Or the opposite — being so fidgety or restless that you have been moving around a lot more than usual",
                options: [
                    { text: "Not at all", value: "0" },
                    { text: "Several days", value: "1" },
                    { text: "More than half the days", value: "2" },
                    { text: "Nearly every day", value: "3" }
                ]
            },
            {
                text: "Thoughts that you would be better off dead, or of hurting yourself in some way",
                options: [
                    { text: "Not at all", value: "0" },
                    { text: "Several days", value: "1" },
                    { text: "More than half the days", value: "2" },
                    { text: "Nearly every day", value: "3" }
                ]
            }
        ]
    },
    {
        id: "dass21",
        title: "Depression, Anxiety and Stress Scale (DASS-21)",
        description: "Measures the negative emotional states of depression, anxiety and stress",
        longDescription: "The DASS-21 is a set of three self-report scales designed to measure the emotional states of depression, anxiety and stress. Each of the three scales contains 7 items, divided into subscales with similar content.",
        duration: "5-8 minutes",
        maxScore: 63,
        questions: [
            {
                text: "I found it hard to wind down",
                options: [
                    { text: "Did not apply to me at all", value: "0" },
                    { text: "Applied to me to some degree", value: "1" },
                    { text: "Applied to me to a considerable degree", value: "2" },
                    { text: "Applied to me very much", value: "3" }
                ]
            },
            {
                text: "I was aware of dryness of my mouth",
                options: [
                    { text: "Did not apply to me at all", value: "0" },
                    { text: "Applied to me to some degree", value: "1" },
                    { text: "Applied to me to a considerable degree", value: "2" },
                    { text: "Applied to me very much", value: "3" }
                ]
            },
            {
                text: "I couldn't seem to experience any positive feeling at all",
                options: [
                    { text: "Did not apply to me at all", value: "0" },
                    { text: "Applied to me to some degree", value: "1" },
                    { text: "Applied to me to a considerable degree", value: "2" },
                    { text: "Applied to me very much", value: "3" }
                ]
            },
            {
                text: "I experienced breathing difficulty (e.g., excessively rapid breathing, breathlessness in the absence of physical exertion)",
                options: [
                    { text: "Did not apply to me at all", value: "0" },
                    { text: "Applied to me to some degree", value: "1" },
                    { text: "Applied to me to a considerable degree", value: "2" },
                    { text: "Applied to me very much", value: "3" }
                ]
            },
            {
                text: "I found it difficult to work up the initiative to do things",
                options: [
                    { text: "Did not apply to me at all", value: "0" },
                    { text: "Applied to me to some degree", value: "1" },
                    { text: "Applied to me to a considerable degree", value: "2" },
                    { text: "Applied to me very much", value: "3" }
                ]
            },
            {
                text: "I tended to over-react to situations",
                options: [
                    { text: "Did not apply to me at all", value: "0" },
                    { text: "Applied to me to some degree", value: "1" },
                    { text: "Applied to me to a considerable degree", value: "2" },
                    { text: "Applied to me very much", value: "3" }
                ]
            },
            {
                text: "I experienced trembling (e.g., in the hands)",
                options: [
                    { text: "Did not apply to me at all", value: "0" },
                    { text: "Applied to me to some degree", value: "1" },
                    { text: "Applied to me to a considerable degree", value: "2" },
                    { text: "Applied to me very much", value: "3" }
                ]
            }
        ]
    }
];
