import OpenAI from 'openai';
import Project from '../models/Project.js';
import dotenv from "dotenv";
dotenv.config();

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

export const getAISuggestions = async (req, res) => {
  try {
    const { projectId, type } = req.body;

    const project = await Project.findById(projectId)
      .populate('owner', 'username');

    if (!project) {
      return res.status(404).json({ message: 'Project not found' });
    }

    // Check access
    const hasAccess = project.owner._id.toString() === req.user._id.toString() ||
      project.collaborators.some(c => c.user.toString() === req.user._id.toString()) ||
      project.isPublic;

    if (!hasAccess) {
      return res.status(403).json({ message: 'Access denied' });
    }

    const currentVersion = project.versions.find(v => v.versionNumber === project.currentVersion);
    const audioFiles = currentVersion?.audioFiles || [];

    let prompt = '';

    if (type === 'mixing') {
      prompt = `As a professional mixing engineer, provide mixing suggestions for this music project:
      
Title: ${project.title}
Description: ${project.description || 'N/A'}
Number of audio tracks: ${audioFiles.length}
Tags: ${project.tags.join(', ') || 'N/A'}

Provide practical mixing advice including:
1. EQ recommendations
2. Compression suggestions
3. Balance and panning tips
4. Reverb and effects recommendations
5. Overall mix structure advice

Keep suggestions concise and actionable.`;

    } else if (type === 'composition') {
      prompt = `As a music composition expert, provide creative suggestions for this music project:
      
Title: ${project.title}
Description: ${project.description || 'N/A'}
Number of audio tracks: ${audioFiles.length}
Tags: ${project.tags.join(', ') || 'N/A'}

Provide composition suggestions including:
1. Arrangement ideas
2. Harmonic suggestions
3. Melodic development
4. Rhythm and groove tips
5. Instrumentation recommendations

Keep suggestions creative and inspiring.`;

    } else {
      return res.status(400).json({ message: 'Invalid suggestion type. Use "mixing" or "composition"' });
    }

    const completion = await openai.chat.completions.create({
      model: "gpt-4",
      messages: [
        {
          role: "system",
          content: "You are a professional music producer and mixing engineer with years of experience. Provide helpful, practical, and actionable advice."
        },
        {
          role: "user",
          content: prompt
        }
      ],
      max_tokens: 500,
      temperature: 0.7
    });

    const suggestion = completion.choices[0].message.content;

    res.json({
      type,
      suggestion,
      projectId,
      generatedAt: new Date()
    });
  } catch (error) {
    console.error('AI suggestion error:', error);
    res.status(500).json({ 
      message: 'Failed to generate AI suggestion', 
      error: error.message 
    });
  }
};

export const analyzeAudio = async (req, res) => {
  try {
    const { audioUrl, projectId } = req.body;

    if (!audioUrl) {
      return res.status(400).json({ message: 'Audio URL is required' });
    }

    // For now, return a placeholder analysis
    // In production, you might want to use OpenAI's audio transcription or other analysis APIs
    res.json({
      message: 'Audio analysis feature coming soon',
      audioUrl,
      projectId
    });
  } catch (error) {
    console.error('Audio analysis error:', error);
    res.status(500).json({ message: 'Analysis failed', error: error.message });
  }
};
