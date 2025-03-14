import { Agent } from '@browser-use/browser-use';
import { ChatOpenAI } from '@langchain/openai';
import * as fs from 'fs';
import * as path from 'path';
import { config } from 'dotenv';

// Load environment variables
config();

// States that need to be researched
const remainingStates = [
  { name: 'Minnesota', abbr: 'MN' },
  { name: 'Mississippi', abbr: 'MS' },
  { name: 'Missouri', abbr: 'MO' },
  { name: 'Montana', abbr: 'MT' },
  { name: 'Nebraska', abbr: 'NE' },
  { name: 'Nevada', abbr: 'NV' },
  { name: 'New Hampshire', abbr: 'NH' },
  { name: 'New Jersey', abbr: 'NJ' },
  { name: 'New Mexico', abbr: 'NM' },
  { name: 'New York', abbr: 'NY' },
  { name: 'North Carolina', abbr: 'NC' },
  { name: 'North Dakota', abbr: 'ND' },
  { name: 'Ohio', abbr: 'OH' },
  { name: 'Oklahoma', abbr: 'OK' },
  { name: 'Oregon', abbr: 'OR' },
  { name: 'Pennsylvania', abbr: 'PA' },
  { name: 'Rhode Island', abbr: 'RI' },
  { name: 'South Carolina', abbr: 'SC' },
  { name: 'South Dakota', abbr: 'SD' },
  { name: 'Tennessee', abbr: 'TN' },
  { name: 'Texas', abbr: 'TX' },
  { name: 'Utah', abbr: 'UT' },
  { name: 'Vermont', abbr: 'VT' },
  { name: 'Virginia', abbr: 'VA' },
  { name: 'Washington', abbr: 'WA' },
  { name: 'West Virginia', abbr: 'WV' },
  { name: 'Wisconsin', abbr: 'WI' },
  { name: 'Wyoming', abbr: 'WY' },
  { name: 'District of Columbia', abbr: 'DC' }
];

// Function to create the prompt for each state
function createPrompt(state: { name: string; abbr: string }): string {
  return `Research accurate LLC formation information for ${state.name} (${state.abbr}). 
  Find and format the following specific details exactly as shown in this template:

  ### ${state.name} (${state.abbr})
  1. Official Website: [exact URL for LLC formation]
  2. Filing Requirements:
     - [List each requirement on a new line with a dash]
     - [Include all mandatory forms and documents]
     - [Include registered agent requirements]
     - [Include name requirements]
  3. Filing Fees:
     - [List each fee on a new line with a dash]
     - [Include online and paper filing fees if applicable]
     - [Include any optional fees like name reservation]
  4. Processing Times:
     - [List each processing time on a new line with a dash]
     - [Include standard and expedited options if available]
     - [Include online vs paper processing times if different]
  5. Annual Report:
     - [List requirements on a new line with a dash]
     - [Include due dates]
     - [Include all associated fees]
     - [Include filing methods]
  6. State Tax Information:
     - [List each tax requirement on a new line with a dash]
     - [Include state income tax rates]
     - [Include sales tax requirements]
     - [Include any special business taxes]
     - [Include license requirements]

  Be specific about fees, deadlines, and requirements. Verify all information is current for 2024.
  Format the response exactly as shown above, maintaining the same heading structure and bullet point style.`;
}

// Function to format the result
function formatResult(state: { name: string; abbr: string }, result: string): string {
  // Remove any extra blank lines
  let formatted = result.replace(/\n\s*\n\s*\n/g, '\n\n');
  
  // Ensure the state header is formatted correctly
  const headerPattern = new RegExp(`###\\s*${state.name}\\s*\\(${state.abbr}\\)`);
  if (!headerPattern.test(formatted)) {
    formatted = `### ${state.name} (${state.abbr})\n${formatted}`;
  }
  
  // Ensure each section starts with a number
  const sections = [
    '1. Official Website:',
    '2. Filing Requirements:',
    '3. Filing Fees:',
    '4. Processing Times:',
    '5. Annual Report:',
    '6. State Tax Information:'
  ];
  
  sections.forEach(section => {
    if (!formatted.includes(section)) {
      formatted = formatted.replace(new RegExp(`${section.replace(/\d\./, '')}`, 'i'), section);
    }
  });
  
  return formatted;
}

// Function to save the results
function saveResults(state: { name: string; abbr: string }, result: string): void {
  const outputDir = path.join(process.cwd(), 'llc-data');
  
  // Create directory if it doesn't exist
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
  }
  
  const formattedResult = formatResult(state, result);
  const filePath = path.join(outputDir, `${state.abbr}.md`);
  fs.writeFileSync(filePath, formattedResult);
  console.log(`Saved data for ${state.name} to ${filePath}`);
}

// Function to update the progress file
function updateProgressFile(state: { name: string; abbr: string }): void {
  const progressFilePath = path.join(process.cwd(), 'llc-research-progress.md');
  
  if (fs.existsSync(progressFilePath)) {
    let content = fs.readFileSync(progressFilePath, 'utf8');
    
    // Replace the unchecked box with a checked box for the completed state
    const uncheckedPattern = new RegExp(`- \\[ \\] ${state.name} \\(${state.abbr}\\)`, 'g');
    content = content.replace(uncheckedPattern, `- [x] ${state.name} (${state.abbr})`);
    
    fs.writeFileSync(progressFilePath, content);
    console.log(`Updated progress for ${state.name}`);
  }
}

// Main function to run the scraper
async function main() {
  // Check for OpenAI API key
  if (!process.env.OPENAI_API_KEY) {
    console.error('Error: OPENAI_API_KEY environment variable is not set');
    process.exit(1);
  }

  const llm = new ChatOpenAI({
    modelName: "gpt-4o",
    temperature: 0.2,
  });

  // Process each state one by one
  for (const state of remainingStates) {
    console.log(`Researching ${state.name}...`);
    
    try {
      const agent = new Agent({
        task: createPrompt(state),
        llm,
        recordVideo: true,
        videoPath: path.join(process.cwd(), 'llc-data', `${state.abbr}-recording.mp4`),
      });
      
      const result = await agent.run();
      
      // Save the results
      saveResults(state, result);
      
      // Update the progress file
      updateProgressFile(state);
      
      // Wait a bit between states to avoid rate limiting
      await new Promise(resolve => setTimeout(resolve, 5000));
    } catch (error) {
      console.error(`Error researching ${state.name}:`, error);
    }
  }
  
  console.log('LLC research completed for all remaining states!');
}

// Run the main function
main().catch(console.error); 