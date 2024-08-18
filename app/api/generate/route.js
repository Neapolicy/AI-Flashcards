import {NextResponse} from 'next/server' 
import {OpenAI} from 'openai' 


const systemPrompt = `
You are a flashcard creator, tasked with generating effective flashcards to help users study and retain information across a variety of topics. Each flashcard should feature a clear, concise question or prompt on one side (Q) and a precise, factual answer on the other side (A). The flashcards should be customized to meet the user's needs, emphasizing key concepts, definitions, or problem-solving strategies. They should be straightforward, free of unnecessary jargon, and designed for quick recall.

Consider the following guidelines when creating flashcards:

- Clarity: Ensure that questions are easy to understand, and answers are accurate and to the point.
- Relevance: Focus on the most important information that needs to be memorized or understood.
- Variety: Include different types of questions, such as definitions, multiple-choice, true/false, or problem-solving prompts.
- Engagement: Where possible, make the content engaging by adding context, examples, or scenarios that make the information more relatable.
- Only generate 10 flashcards.

Format Guide:

- Question (Q): A direct question or prompt that addresses a specific piece of information.
- Answer (A): A precise answer or explanation that directly responds to the question.

Return the following in json format
{
    "flashcards":[
      {
          "front": str,
          "back": str
      }
    ]
}
`;

export async function POST(req) {
  const openai = new OpenAI({
    baseURL: 'https://openrouter.ai/api/v1',
    apiKey: process.env.OPENAI_API_KEY
  }) 
  const data = await req.json()
  console.log(data)

  // Create a chat completion request to the OpenAI API
  const completion = await openai.chat.completions.create({
    messages: [{role: 'system', content: systemPrompt}, {role: 'user', content: data}], // Include the system prompt and user messages
    model: 'meta-llama/llama-3.1-8b-instruct:free', // Specify the model to use
    stream: true, // Enable streaming responses
    response_format: {type: 'json_object'},
  })

  // Create a ReadableStream to handle the streaming response
  const stream = new ReadableStream({
    async start(controller) {
      const encoder = new TextEncoder() // Create a TextEncoder to convert strings to Uint8Array
      try {
        // Iterate over the streamed chunks of the response
        for await (const chunk of completion) {
          const content = chunk.choices[0]?.delta?.content // Extract the content from the chunk
          if (content) {
            const text = encoder.encode(content) // Encode the content to Uint8Array
            controller.enqueue(text) // Enqueue the encoded text to the stream
          }
        }
      } catch (err) {
        controller.error(err) // Handle any errors that occur during streaming
      } finally {
        controller.close() // Close the stream when done
      }
    },
  })

  return new NextResponse(stream) // Return the stream as the response
}