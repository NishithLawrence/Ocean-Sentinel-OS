"""
Self-contained production seeding service for Ocean Sentinel OS.
Populates production database with processed marine intelligence data on startup without relying on external file imports.

Path: backend/app/services/seed_service.py
"""
import logging
from datetime import date
from sqlalchemy.orm import Session

from app.models.reef import Reef
from app.models.team import Team
from app.models.mission import Mission
from app.models.user import User

logger = logging.getLogger('seed_service')

SEED_REEFS = [
    {"reef_name": "Great Barrier Reef - Sector A", "country": "Australia", "latitude": -18.2871, "longitude": 147.6992, "coral_health": 87.0, "sea_temperature": 23.86, "bleaching_alert": False, "protected_area": True, "ghost_net_distance": 175.54},
    {"reef_name": "Coral Reef Feature #1", "country": "India", "latitude": 9.167513, "longitude": 78.820817, "coral_health": 73.85, "sea_temperature": 29.7, "bleaching_alert": False, "protected_area": True, "ghost_net_distance": 1764.73},
    {"reef_name": "Tubbataha Reefs", "country": "Philippines", "latitude": 8.952, "longitude": 119.885, "coral_health": 81.5, "sea_temperature": 29.83, "bleaching_alert": False, "protected_area": True, "ghost_net_distance": 4.3},
    {"reef_name": "Belize Barrier Reef", "country": "Belize", "latitude": 17.315, "longitude": -87.534, "coral_health": 48.0, "sea_temperature": 29.52, "bleaching_alert": False, "protected_area": True, "ghost_net_distance": 1.6},
    {"reef_name": "Raja Ampat", "country": "Indonesia", "latitude": -0.234, "longitude": 130.512, "coral_health": 92.0, "sea_temperature": 28.82, "bleaching_alert": False, "protected_area": True, "ghost_net_distance": 85.87},
    {"reef_name": "Maldives Atoll", "country": "Maldives", "latitude": 3.202, "longitude": 73.221, "coral_health": 64.0, "sea_temperature": 29.44, "bleaching_alert": False, "protected_area": True, "ghost_net_distance": 965.84},
    {"reef_name": "Ningaloo Reef", "country": "Australia", "latitude": -22.741, "longitude": 113.678, "coral_health": 79.0, "sea_temperature": 23.37, "bleaching_alert": False, "protected_area": True, "ghost_net_distance": 1.7},
    {"reef_name": "Apo Reef", "country": "Philippines", "latitude": 13.659, "longitude": 120.462, "coral_health": 58.0, "sea_temperature": 29.97, "bleaching_alert": False, "protected_area": True, "ghost_net_distance": 480.99},
    {"reef_name": "Red Sea Reef", "country": "Saudi Arabia", "latitude": 22.318, "longitude": 38.921, "coral_health": 71.0, "sea_temperature": 31.25, "bleaching_alert": False, "protected_area": True, "ghost_net_distance": 725.17},
    {"reef_name": "Palau Reefs", "country": "Palau", "latitude": 7.515, "longitude": 134.582, "coral_health": 85.0, "sea_temperature": 28.65, "bleaching_alert": False, "protected_area": True, "ghost_net_distance": 2.6},
    {"reef_name": "Florida Keys", "country": "USA", "latitude": 24.55, "longitude": -81.78, "coral_health": 42.0, "sea_temperature": 30.91, "bleaching_alert": False, "protected_area": True, "ghost_net_distance": 1001.23},
]

SEED_TEAMS = [
    {"team_name": "Team Alpha", "specialization": "Survey Specialist", "region": "Australia"},
    {"team_name": "Team Bravo", "specialization": "Cleanup Specialist", "region": "Philippines"},
    {"team_name": "Team Charlie", "specialization": "Monitoring Specialist", "region": "Belize"},
    {"team_name": "Team Delta", "specialization": "Restoration Specialist", "region": "Indonesia"},
    {"team_name": "Team Echo", "specialization": "Mapping Specialist", "region": "Maldives"},
    {"team_name": "Team Foxtrot", "specialization": "Inspection Specialist", "region": "Philippines"},
    {"team_name": "Team Golf", "specialization": "Coral Survey Specialist", "region": "Saudi Arabia"},
]

SEED_MISSIONS = [
    {"mission_name": "Coral Health Survey", "reef": "Great Barrier Reef - Sector A", "team": "Team Alpha", "priority": "High", "status": "Completed", "start": date(2026, 1, 12), "end": date(2026, 1, 14), "notes": "Assess bleaching severity — No major issues"},
    {"mission_name": "Ghost Net Removal", "reef": "Tubbataha Reefs", "team": "Team Bravo", "priority": "Critical", "status": "In Progress", "start": date(2026, 2, 3), "end": date(2026, 2, 6), "notes": "Remove ghost nets — 2 nets removed"},
    {"mission_name": "Water Quality Check", "reef": "Belize Barrier Reef", "team": "Team Charlie", "priority": "Medium", "status": "Planned", "start": date(2026, 3, 10), "end": date(2026, 3, 11), "notes": "Measure turbidity"},
    {"mission_name": "Coral Restoration", "reef": "Raja Ampat", "team": "Team Delta", "priority": "High", "status": "Planned", "start": date(2026, 4, 5), "end": date(2026, 4, 12), "notes": "Plant coral fragments"},
    {"mission_name": "Drone Mapping", "reef": "Maldives Atoll", "team": "Team Echo", "priority": "Medium", "status": "Completed", "start": date(2026, 5, 20), "end": date(2026, 5, 21), "notes": "Capture aerial imagery — Orthomosaic generated"},
    {"mission_name": "Bleaching Assessment", "reef": "Ningaloo Reef", "team": "Team Alpha", "priority": "Critical", "status": "Completed", "start": date(2026, 6, 15), "end": date(2026, 6, 17), "notes": "Validate NOAA alerts"},
    {"mission_name": "MPA Inspection", "reef": "Apo Reef", "team": "Team Foxtrot", "priority": "Low", "status": "In Progress", "start": date(2026, 7, 8), "end": date(2026, 7, 9), "notes": "Check protected zone"},
    {"mission_name": "Biodiversity Survey", "reef": "Red Sea Reef", "team": "Team Golf", "priority": "Medium", "status": "Planned", "start": date(2026, 8, 1), "end": date(2026, 8, 3), "notes": "Fish and coral census"},
    {"mission_name": "Marine Debris Survey", "reef": "Palau Reefs", "team": "Team Bravo", "priority": "High", "status": "Planned", "start": date(2026, 8, 15), "end": date(2026, 8, 16), "notes": "Map debris hotspots"},
    {"mission_name": "Emergency Reef Response", "reef": "Florida Keys", "team": "Team Alpha", "priority": "Critical", "status": "Planned", "start": date(2026, 9, 2), "end": date(2026, 9, 5), "notes": "Respond to bleaching event"},
]

_is_seeding = False


def seed_database_if_empty(db: Session) -> None:
    """Self-contained startup seeding of production database."""
    global _is_seeding
    if _is_seeding:
        return
    _is_seeding = True

    try:
        # 1. Seed Reefs
        reef_map = {}
        for r in db.query(Reef).all():
            reef_map[r.reef_name] = r

        if len(reef_map) < len(SEED_REEFS):
            logger.info("Seeding production reef records...")
            for r_data in SEED_REEFS:
                if r_data["reef_name"] not in reef_map:
                    reef = Reef(**r_data)
                    db.add(reef)
                    db.flush()
                    reef_map[reef.reef_name] = reef
            db.commit()

        # 2. Seed Teams
        team_map = {}
        for t in db.query(Team).all():
            team_map[t.team_name] = t

        if len(team_map) < len(SEED_TEAMS):
            logger.info("Seeding production response team records...")
            for t_data in SEED_TEAMS:
                if t_data["team_name"] not in team_map:
                    team = Team(
                        team_name=t_data["team_name"],
                        leader_name=f"Commander ({t_data['team_name']})",
                        specialization=t_data["specialization"],
                        member_count=6,
                        contact_email=f"{t_data['team_name'].lower().replace(' ', '')}@oceansentinel.org",
                        contact_phone="+1-555-0199",
                        region=t_data["region"],
                        availability=True,
                        status="Available"
                    )
                    db.add(team)
                    db.flush()
                    team_map[team.team_name] = team
            db.commit()

        # 3. Seed User
        creator = db.query(User).first()

        # 4. Seed Missions
        existing_missions = {m.mission_name for m in db.query(Mission).all()}
        if len(existing_missions) < len(SEED_MISSIONS):
            logger.info("Seeding production mission records...")
            for m_data in SEED_MISSIONS:
                if m_data["mission_name"] not in existing_missions:
                    target_reef = reef_map.get(m_data["reef"]) or db.query(Reef).first()
                    target_team = team_map.get(m_data["team"]) or db.query(Team).first()
                    mission = Mission(
                        mission_name=m_data["mission_name"],
                        reef_id=target_reef.id,
                        team_id=target_team.id,
                        created_by=creator.id if creator else 1,
                        mission_date=m_data["start"],
                        completed_date=m_data["end"],
                        priority=m_data["priority"],
                        status=m_data["status"],
                        notes=m_data["notes"]
                    )
                    db.add(mission)
            db.commit()

        # 5. Generate Risk Signal Alerts if missing
        from app.models.alert import Alert
        if db.query(Alert).first() is None:
            from app.services.risk_assessment_service import create_assessment
            for reef in db.query(Reef).all():
                create_assessment(db, reef.id)
            db.commit()

        # Output required startup log
        reefs_cnt = db.query(Reef).count()
        teams_cnt = db.query(Team).count()
        missions_cnt = db.query(Mission).count()

        print(f"[SEED] Reefs imported: {reefs_cnt}")
        print(f"[SEED] Teams imported: {teams_cnt}")
        print(f"[SEED] Missions imported: {missions_cnt}")

        logger.info(f"[SEED] Reefs imported: {reefs_cnt}")
        logger.info(f"[SEED] Teams imported: {teams_cnt}")
        logger.info(f"[SEED] Missions imported: {missions_cnt}")

    except Exception as e:
        db.rollback()
        logger.error(f"Production seeding error: {e}")
        raise
    finally:
        _is_seeding = False
