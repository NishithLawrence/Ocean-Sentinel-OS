# Ocean Sentinel OS

# AI Risk Engine Specification

> Version: 1.0
>
> Module: AI Decision Intelligence
>
> AI Type: Explainable Rule-Based Risk Assessment
>
> Future Upgrade: Machine Learning Model

---

# Table of Contents

1. Overview
2. Objectives
3. AI Workflow
4. Input Parameters
5. Risk Scoring Algorithm
6. Risk Classification
7. Explainable AI
8. Team Recommendation Engine
9. Example Assessment
10. Future AI Roadmap

---

# 1. Overview

The AI Risk Engine is responsible for analyzing environmental data and recommending which coral reefs require immediate conservation action.

The AI does **not** make autonomous decisions.

Instead, it acts as a Decision Support System (DSS) by:

- Evaluating reef health
- Assessing environmental threats
- Calculating a priority score
- Explaining its reasoning
- Recommending operational actions

Final decisions always remain with the government officer.

---

# 2. Objectives

The AI should:

- Identify high-risk reefs
- Prioritize cleanup missions
- Recommend the most suitable cleanup team
- Explain every recommendation
- Produce consistent results for the same inputs

---

# 3. AI Workflow

```
Load Reef Data

↓

Load Environmental Data

↓

Evaluate Coral Health

↓

Evaluate Ghost Net Risk

↓

Evaluate Protected Area Status

↓

Evaluate Weather Conditions

↓

Calculate Risk Score

↓

Classify Risk Level

↓

Generate Explanation

↓

Recommend Mission Priority

↓

Recommend Best Team

↓

Display Results
```

---

# 4. Input Parameters

The AI uses the following inputs.

| Parameter | Description |
|------------|-------------|
| Coral Health | Reef condition (0–100) |
| Sea Temperature | Current water temperature |
| Bleaching Alert | Coral bleaching detected |
| Ghost Net Distance | Distance to nearest ghost net |
| Protected Area | Protected or not |
| Weather Condition | Calm / Moderate / Severe |

---

# 5. Risk Scoring Algorithm

The Priority Score ranges from **0 to 100**.

### Coral Health (40%)

| Coral Health | Score |
|---------------|------|
| 80–100 | 10 |
| 60–79 | 25 |
| 40–59 | 35 |
| Below 40 | 40 |

---

### Ghost Net Distance (25%)

| Distance | Score |
|----------|------|
| >10 km | 0 |
| 5–10 km | 10 |
| 2–5 km | 18 |
| <2 km | 25 |

---

### Bleaching Alert (20%)

| Status | Score |
|---------|------|
| No | 0 |
| Yes | 20 |

---

### Weather Condition (10%)

| Weather | Score |
|----------|------|
| Calm | 2 |
| Moderate | 6 |
| Severe | 10 |

---

### Protected Area (5%)

| Status | Score |
|---------|------|
| No | 0 |
| Yes | 5 |

---

# Final Score

```
Priority Score =

Coral Health Score
+ Ghost Net Score
+ Bleaching Score
+ Weather Score
+ Protected Area Score
```

Maximum Score = **100**

---

# 6. Risk Classification

| Score | Risk Level |
|--------|------------|
| 0–25 | LOW |
| 26–50 | MEDIUM |
| 51–75 | HIGH |
| 76–100 | CRITICAL |

---

# 7. Explainable AI

The system must explain why a reef received its score.

Example:

```
Priority Score: 84

Risk Level: CRITICAL

Reasons:

✓ Coral health has fallen below 40%.

✓ Ghost net detected within 1 km.

✓ Coral bleaching alert is active.

✓ Reef is inside a protected marine area.

Recommended Action:

Create an immediate cleanup mission.
```

The explanation should be human-readable and easy for officers to understand.

---

# 8. AI Team Recommendation Engine

After determining that a mission is needed, the AI recommends the most suitable team.

Evaluation Criteria:

| Factor | Priority |
|----------|---------|
| Availability | High |
| Region Match | High |
| Specialization | High |
| Current Workload | Medium |

Selection Process

```
Retrieve Available Teams

↓

Filter by Region

↓

Filter by Availability

↓

Check Specialization

↓

Rank Teams

↓

Recommend Best Team
```

The recommendation includes:

- Team Name
- Reason for recommendation
- Confidence Level

The officer may override the recommendation.

---

# 9. Example Assessment

Input

```
Reef Name:
Heron Reef

Coral Health:
35

Ghost Net Distance:
1.2 km

Bleaching:
Yes

Weather:
Moderate

Protected Area:
Yes
```

Calculation

```
Coral Health = 40

Ghost Net = 25

Bleaching = 20

Weather = 6

Protected Area = 5

Total = 96
```

Output

```
Priority Score = 96

Risk Level = CRITICAL

Recommendation

Deploy cleanup mission immediately.

Suggested Team

Coral Guardians Alpha

Confidence

95%
```

---

# 10. Future AI Roadmap

Future versions may include:

- Machine Learning risk prediction
- Satellite image analysis
- Coral bleaching forecasting
- Time-series trend prediction
- Automatic anomaly detection
- Reinforcement learning for mission planning
- Multi-agent optimization
- Climate impact forecasting

---

# AI Design Principles

- Explainable
- Transparent
- Deterministic
- Reliable
- Human-in-the-loop
- Modular
- Easy to improve

The AI must always provide explanations alongside recommendations.

---

# End of Document