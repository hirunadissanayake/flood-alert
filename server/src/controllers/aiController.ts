import { Response } from 'express';
import axios from 'axios';
import FloodReport from '../models/FloodReport';
import { AuthRequest } from '../types';

// @desc    Generate AI flood summary
// @route   POST /api/ai/summary
// @access  Private/Admin
export const generateSummary = async (req: AuthRequest, res: Response) => {
  try {
    // Get recent flood reports
    const reports = await FloodReport.find()
      .populate('userId', 'name')
      .sort({ timestamp: -1 })
      .limit(50);

    if (reports.length === 0) {
      return res.json({ success: true, data: { summary: 'No flood reports available for analysis.' } });
    }

    // Prepare data for AI
    const reportData = reports.map(r => ({
      location: r.location.address,
      waterLevel: r.waterLevel,
      description: r.description,
      timestamp: r.timestamp
    }));

    // Create prompt for AI
    const prompt = `Analyze the following flood situation reports from Sri Lanka and provide a comprehensive summary including:
1. Overall severity assessment
2. Most affected areas
3. Recommended actions and warnings
4. Key patterns or trends

Reports data:
${JSON.stringify(reportData, null, 2)}

Please provide a concise but informative summary suitable for emergency management.`;

    let aiResponse;

    // Call AI API based on provider
    const aiProvider = process.env.AI_PROVIDER?.toLowerCase();
    
    if (aiProvider === 'openai') {
      const response = await axios.post(
        'https://api.openai.com/v1/chat/completions',
        {
          model: 'gpt-3.5-turbo',
          messages: [{ role: 'user', content: prompt }],
          max_tokens: 500
        },
        {
          headers: {
            'Authorization': `Bearer ${process.env.AI_API_KEY}`,
            'Content-Type': 'application/json'
          }
        }
      );
      
      if (!response.data?.choices?.[0]?.message?.content) {
        throw new Error('Invalid response from OpenAI API');
      }
      aiResponse = response.data.choices[0].message.content;
    } else if (aiProvider === 'google') {
      // Google Gemini API
      const response = await axios.post(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=${process.env.AI_API_KEY}`,
        {
          contents: [{
            parts: [{
              text: prompt
            }]
          }]
        },
        {
          headers: {
            'Content-Type': 'application/json'
          }
        }
      );
      
      if (!response.data?.candidates?.[0]?.content?.parts?.[0]?.text) {
        throw new Error('Invalid response from Google Gemini API');
      }
      aiResponse = response.data.candidates[0].content.parts[0].text;
    } else {
      aiResponse = 'AI integration not configured. Please set AI_API_KEY and AI_PROVIDER in environment variables.';
    }

    res.json({
      success: true,
      data: {
        summary: aiResponse,
        reportsAnalyzed: reports.length,
        generatedAt: new Date()
      }
    });
  } catch (error: any) {
    console.error('AI Summary Error:', error.response?.data || error.message);
    res.status(500).json({ 
      success: false, 
      message: 'Failed to generate AI summary',
      error: error.response?.data?.error?.message || error.message 
    });
  }
};

// @desc    Generate AI warning message
// @route   POST /api/ai/warning-message
// @access  Private/Admin
export const generateWarningMessage = async (req: AuthRequest, res: Response) => {
  try {
    const { area, severity, specificDetails } = req.body;

    const prompt = `Generate a clear and urgent warning message for residents of ${area} regarding a ${severity} flood situation. 
Additional context: ${specificDetails || 'None provided'}

The message should:
1. Be in English and suitable for public broadcast
2. Include safety instructions
3. Mention evacuation if necessary
4. Provide emergency contact information template
5. Be concise (under 200 words)`;

    let warningMessage;
    const aiProvider = process.env.AI_PROVIDER?.toLowerCase();

    if (aiProvider === 'openai') {
      const response = await axios.post(
        'https://api.openai.com/v1/chat/completions',
        {
          model: 'gpt-3.5-turbo',
          messages: [{ role: 'user', content: prompt }],
          max_tokens: 300
        },
        {
          headers: {
            'Authorization': `Bearer ${process.env.AI_API_KEY}`,
            'Content-Type': 'application/json'
          }
        }
      );
      
      if (!response.data?.choices?.[0]?.message?.content) {
        throw new Error('Invalid response from OpenAI API');
      }
      warningMessage = response.data.choices[0].message.content;
    } else if (aiProvider === 'google') {
      // Google Gemini API
      const response = await axios.post(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=${process.env.AI_API_KEY}`,
        {
          contents: [{
            parts: [{
              text: prompt
            }]
          }]
        },
        {
          headers: {
            'Content-Type': 'application/json'
          }
        }
      );
      
      if (!response.data?.candidates?.[0]?.content?.parts?.[0]?.text) {
        throw new Error('Invalid response from Google Gemini API');
      }
      warningMessage = response.data.candidates[0].content.parts[0].text;
    } else {
      warningMessage = 'AI integration not configured. Please set AI_API_KEY and AI_PROVIDER in environment variables.';
    }

    res.json({
      success: true,
      data: {
        message: warningMessage,
        generatedAt: new Date()
      }
    });
  } catch (error: any) {
    console.error('AI Warning Message Error:', error.response?.data || error.message);
    res.status(500).json({ 
      success: false, 
      message: 'Failed to generate warning message',
      error: error.response?.data?.error?.message || error.message 
    });
  }
};

// @desc    Generate AI daily flood summary
// @route   GET /api/ai/daily-summary
// @access  Private/Admin
export const generateDailySummary = async (req: AuthRequest, res: Response) => {
  try {
    // Get today's flood reports
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    const reports = await FloodReport.find({
      timestamp: { $gte: today }
    })
      .populate('userId', 'name')
      .sort({ timestamp: -1 });

    if (reports.length === 0) {
      return res.json({ 
        success: true, 
        data: { 
          summary: 'No flood reports recorded today.',
          reportsCount: 0,
          highRiskAreas: [],
          overallSeverity: 'None'
        } 
      });
    }

    // Analyze data
    const severityCounts = {
      low: reports.filter(r => r.waterLevel === 'low').length,
      medium: reports.filter(r => r.waterLevel === 'medium').length,
      high: reports.filter(r => r.waterLevel === 'high').length,
      severe: reports.filter(r => r.waterLevel === 'severe').length
    };

    // Get high-risk areas
    const highRiskReports = reports.filter(r => 
      r.waterLevel === 'high' || r.waterLevel === 'severe'
    );
    const highRiskAreas = [...new Set(highRiskReports.map(r => r.location.address))];

    // Create AI prompt
    const prompt = `You are a disaster management AI analyzing today's flood situation in Sri Lanka.

Today's Flood Report Statistics:
- Total Reports: ${reports.length}
- Low: ${severityCounts.low}
- Medium: ${severityCounts.medium}
- High: ${severityCounts.high}
- Severe: ${severityCounts.severe}

High-Risk Areas: ${highRiskAreas.join(', ') || 'None'}

Recent Report Details:
${reports.slice(0, 10).map(r => `- ${r.location.address}: ${r.waterLevel} level - ${r.description}`).join('\n')}

Please provide:
1. Overall flood condition assessment (one sentence)
2. High-risk areas and warnings (bullet points)
3. Recommended immediate actions for authorities
4. Safety advice for residents

Keep it concise and actionable.`;

    let aiSummary;
    const aiProvider = process.env.AI_PROVIDER?.toLowerCase();

    if (aiProvider === 'openai') {
      const response = await axios.post(
        'https://api.openai.com/v1/chat/completions',
        {
          model: 'gpt-3.5-turbo',
          messages: [{ role: 'user', content: prompt }],
          max_tokens: 600
        },
        {
          headers: {
            'Authorization': `Bearer ${process.env.AI_API_KEY}`,
            'Content-Type': 'application/json'
          }
        }
      );
      
      if (!response.data?.choices?.[0]?.message?.content) {
        throw new Error('Invalid response from OpenAI API');
      }
      aiSummary = response.data.choices[0].message.content;
    } else if (aiProvider === 'google') {
      const response = await axios.post(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=${process.env.AI_API_KEY}`,
        {
          contents: [{
            parts: [{
              text: prompt
            }]
          }]
        },
        {
          headers: {
            'Content-Type': 'application/json'
          }
        }
      );
      
      if (!response.data?.candidates?.[0]?.content?.parts?.[0]?.text) {
        throw new Error('Invalid response from Google Gemini API');
      }
      aiSummary = response.data.candidates[0].content.parts[0].text;
    } else {
      aiSummary = `Daily Summary (AI not configured):\nTotal reports: ${reports.length}\nHigh-risk areas: ${highRiskAreas.join(', ') || 'None'}`;
    }

    res.json({
      success: true,
      data: {
        summary: aiSummary,
        statistics: severityCounts,
        highRiskAreas,
        reportsCount: reports.length,
        overallSeverity: severityCounts.severe > 0 ? 'Severe' : 
                         severityCounts.high > 0 ? 'High' :
                         severityCounts.medium > 0 ? 'Medium' : 'Low',
        generatedAt: new Date()
      }
    });
  } catch (error: any) {
    console.error('AI Daily Summary Error:', error.response?.data || error.message);
    res.status(500).json({ 
      success: false, 
      message: 'Failed to generate daily summary',
      error: error.response?.data?.error?.message || error.message 
    });
  }
};

// @desc    Generate emergency SMS message
// @route   POST /api/ai/emergency-message
// @access  Private/Admin
export const generateEmergencyMessage = async (req: AuthRequest, res: Response) => {
  try {
    const { area, severity, language = 'english' } = req.body;

    if (!area || !severity) {
      return res.status(400).json({
        success: false,
        message: 'Area and severity are required'
      });
    }

    const prompt = `Generate a SHORT emergency SMS message (max 160 characters) for:
Area: ${area}
Flood Severity: ${severity}
Language: ${language}

Requirements:
- Must be under 160 characters (SMS limit)
- Clear and urgent
- Include safety action
- No special formatting

Example format: "FLOOD ALERT: High water in [area]. Evacuate to higher ground. Call 119 for help."`;

    let smsMessage;
    const aiProvider = process.env.AI_PROVIDER?.toLowerCase();

    if (aiProvider === 'openai') {
      const response = await axios.post(
        'https://api.openai.com/v1/chat/completions',
        {
          model: 'gpt-3.5-turbo',
          messages: [{ role: 'user', content: prompt }],
          max_tokens: 100
        },
        {
          headers: {
            'Authorization': `Bearer ${process.env.AI_API_KEY}`,
            'Content-Type': 'application/json'
          }
        }
      );
      
      if (!response.data?.choices?.[0]?.message?.content) {
        throw new Error('Invalid response from OpenAI API');
      }
      smsMessage = response.data.choices[0].message.content.trim();
    } else if (aiProvider === 'google') {
      const response = await axios.post(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=${process.env.AI_API_KEY}`,
        {
          contents: [{
            parts: [{
              text: prompt
            }]
          }]
        },
        {
          headers: {
            'Content-Type': 'application/json'
          }
        }
      );
      
      if (!response.data?.candidates?.[0]?.content?.parts?.[0]?.text) {
        throw new Error('Invalid response from Google Gemini API');
      }
      smsMessage = response.data.candidates[0].content.parts[0].text.trim();
    } else {
      smsMessage = `FLOOD ALERT: ${severity.toUpperCase()} flood in ${area}. Evacuate immediately. Call 119.`;
    }

    res.json({
      success: true,
      data: {
        message: smsMessage,
        characterCount: smsMessage.length,
        area,
        severity,
        generatedAt: new Date()
      }
    });
  } catch (error: any) {
    console.error('AI Emergency Message Error:', error.response?.data || error.message);
    res.status(500).json({ 
      success: false, 
      message: 'Failed to generate emergency message',
      error: error.response?.data?.error?.message || error.message 
    });
  }
};
