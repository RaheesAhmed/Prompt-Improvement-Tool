# Prompt Improvement Tool

This tool enhances prompts by generating multiple versions of them. It's especially useful for GPT-3 applications where the quality of the prompt can significantly impact the output.

## Getting Started

### Prerequisites

- Node.js installed on your system. If you don't have Node.js installed, download and install it from [Node.js downloads](https://nodejs.org/en/download/).

### Installation

1. **Clone the Repository**

   ```
   git clone https://github.com/RaheesAhmed/Prompt-Improvement-Tool.git
   ```

2. **Set Up Environment Variables**

   Create a `.env` file in the project root and add your OpenAI API key:

   ```
   OPENAI_API_KEY=YOUR_API_KEY_HERE
   ```

3. **Install Dependencies**
   Navigate to your project directory in the terminal and run:

   ```
   npm install
   ```

4. **Start the Server**

   ```
   npm start
   ```

   The application will be running at localhost:3000.

5. **Usage**
   Open your web browser and go to `http://localhost:3000`. You'll find the prompt improvement
   interface. Type your prompt into the textarea and click "Improve Prompt" to see the
   enhanced versions.
