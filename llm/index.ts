import { GoogleGenAI } from "@google/genai";

// Configure the client
const ai = new GoogleGenAI({});

// Define the function declaration for the model
function calculate_sum(a, b) {
  return a + b;
}

function product(a, b) {
  return a * b;
}

function power(a, b) {
  return a ^ b;
}

const toolFunctions = {
  calculate_sum,
  product,
  power,
};

const tools = [
  {
    functionDeclarations: [
      {
        name: "sum_of_two_numbers",
        description: "sum of two numbers",
        parameters: {
          type: "object",
          properties: {
            a: {
              type: "number",
            },
            b: {
              type: "number",
            },
          },
          required: ["a", "b"],
        },
      },
      {
        name: "product_two_numbers",
        description: "Product of two numbers",
        parameters: {
          type: "object",
          properties: {
            a: {
              type: "number",
            },
            b: {
              type: "number",
            },
          },
          required: ["a", "b"],
        },
      },
      {
        name: "power_of_two_numbers",
        description: "Power of two numbers",
        parameters: {
          type: "object",
          properties: {
            a: {
              type: "number",
            },
            b: {
              type: "number",
            },
          },
          required: ["a", "b"],
        },
      },
    ],
  },
];

// Send request with function declarations
// const response = await ai.models.generateContent({
//   model: "gemini-2.5-flash",
//   contents:
//     "First calculate 3 + 4, then multiply by 2, then raise it to power of 2",
//   config: {
//     tools: [
//       {
//         functionDeclarations: allFunction,
//       },
//     ],
//   },
// });

// Check for function calls in the response
// if (response.functionCalls && response.functionCalls.length > 0) {
//   console.log(" all Function to call", response.functionCalls);
//   const functionCall = response.functionCalls[0]; // Assuming one function call
//   console.log(`Function to call: ${functionCall.name}`);
//   console.log(`Arguments: ${JSON.stringify(functionCall.args)}`);
//   // In a real app, you would call your actual function here:
//   // const result = await scheduleMeeting(functionCall.args);
// } else {
//   console.log("No function call found in the response.");
//   console.log(response.text);
// }

// All function declaration

// const tool_call = response.functionCalls[0];

// let result;

// if (tool_call.name === "sum_of_two_numbers") {
//   result = calculate_sum(tool_call?.args.a, tool_call?.args.b);
//   console.log(`Function execution result: ${JSON.stringify(result)}`);
// } else if (tool_call.name === "product_two_numbers") {
//   result = product(tool_call?.args.a, tool_call?.args.b);
//   console.log(`Function execution result: ${JSON.stringify(result)}`);
// } else if (tool_call.name === "power_of_two_numbers") {
//   result = power(tool_call?.args.a, tool_call?.args.b);
//   console.log(`Function execution result: ${JSON.stringify(result)}`);
// }

//////////

let contents = [
  {
    role: "user",
    parts: [
      {
        text: "First calculate 3 + 4, then multiply by 2, then raise it to power of 2",
      },
    ],
  },
];

while (true) {
  const result = await ai.models.generateContent({
    model: "gemini-2.5-flash",
    contents,
    config: tools,
  });

  if (result.functionCalls && result.functionCalls.length > 0) {
    const functionCall = result.functionCalls[0];

    const { name, args } = functionCall;

    if (!toolFunctions[name]) {
      throw new Error(`Unknown function call: ${name}`);
    }

    // Call the function and get the response.
    const toolResponse = toolFunctions[name](args);

    const functionResponsePart = {
      name: functionCall.name,
      response: {
        result: toolResponse,
      },
    };

    // Send the function response back to the model.
    contents.push({
      role: "model",
      parts: [
        {
          functionCall: functionCall,
        },
      ],
    });
    contents.push({
      role: "user",
      parts: [
        {
          functionResponse: functionResponsePart,
        },
      ],
    });
  } else {
    // No more function calls, break the loop.
    console.log(result.text);
    break;
  }
}
