# Enso AI Architecture

## Overview
Enso uses Google Gemini for AI-powered insights. The AI system processes user journal entries, daily sessions, and meditation data to generate personalized insights.

## Pipeline Architecture
- **Daily Insight**: Generated daily from journal entries and sessions
- **Weekly Insight**: Aggregated weekly patterns and trends
- **Monthly Insight**: Deep monthly reflection and trajectory
- **Journal Insight**: Per-entry analysis and pattern detection
- **Meditation Recommendation**: Personalized meditation suggestions
- **Pattern Engine**: Detects recurring themes and emotional patterns

## Data Flow
1. User creates journal entry or session
2. Cloud Function triggers AI pipeline
3. Gemini processes content with privacy-safe prompts
4. Insights stored in user subcollections
5. UI renders insights with editorial presentation

## Privacy
- AI never exposes raw journal content in insights
- All processing happens server-side
- User can delete all data at any time
