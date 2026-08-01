"""Deterministic ReportLab PDF generation for operational mission reports."""
from datetime import UTC, datetime
from pathlib import Path

from reportlab.lib import colors
from reportlab.lib.pagesizes import A4
from reportlab.lib.styles import getSampleStyleSheet
from reportlab.lib.units import mm
from reportlab.platypus import Flowable, Paragraph, SimpleDocTemplate, Spacer, Table, TableStyle


class OceanSentinelLogo(Flowable):
    """A compact, vector Ocean Sentinel wave mark and wordmark."""

    def __init__(self):
        super().__init__()
        self.width = 170 * mm
        self.height = 16 * mm

    def draw(self):
        canvas = self.canv
        canvas.setFillColor(colors.HexColor('#075985'))
        canvas.circle(7 * mm, 8 * mm, 7 * mm, fill=1, stroke=0)
        canvas.setStrokeColor(colors.white)
        canvas.setLineWidth(1.2)
        canvas.arc(3 * mm, 5 * mm, 11 * mm, 10 * mm, 195, 150)
        canvas.arc(3 * mm, 2.5 * mm, 11 * mm, 8 * mm, 195, 150)
        canvas.setFillColor(colors.HexColor('#075985'))
        canvas.setFont('Helvetica-Bold', 15)
        canvas.drawString(18 * mm, 9 * mm, 'OCEAN SENTINEL')
        canvas.setFillColor(colors.HexColor('#0f766e'))
        canvas.setFont('Helvetica', 7)
        canvas.drawString(18 * mm, 5 * mm, 'OPERATIONS REPORT')


def _detail_table(rows: list[tuple[str, object]]):
    table = Table([[Paragraph(f'<b>{label}</b>', getSampleStyleSheet()['BodyText']), Paragraph(str(value if value is not None else 'Not recorded'), getSampleStyleSheet()['BodyText'])] for label, value in rows], colWidths=[50 * mm, 120 * mm])
    table.setStyle(TableStyle([('BACKGROUND', (0, 0), (0, -1), colors.HexColor('#f0f9ff')), ('GRID', (0, 0), (-1, -1), 0.25, colors.HexColor('#cbd5e1')), ('VALIGN', (0, 0), (-1, -1), 'TOP'), ('LEFTPADDING', (0, 0), (-1, -1), 6), ('RIGHTPADDING', (0, 0), (-1, -1), 6), ('TOPPADDING', (0, 0), (-1, -1), 5), ('BOTTOMPADDING', (0, 0), (-1, -1), 5)]))
    return table


def generate_mission_report(output_path: Path, mission) -> None:
    """Create a PDF from persisted mission, reef, and team data without AI analysis."""
    output_path.parent.mkdir(parents=True, exist_ok=True)
    styles = getSampleStyleSheet()
    document = SimpleDocTemplate(str(output_path), pagesize=A4, rightMargin=20 * mm, leftMargin=20 * mm, topMargin=16 * mm, bottomMargin=16 * mm)
    reef = mission.reef
    team = mission.team
    generated_date = datetime.now(UTC).strftime('%d %B %Y')
    summary = f'Mission "{mission.title}" is scheduled for {mission.scheduled_date} and is currently marked {mission.status}. It supports {reef.reef_name} in {reef.country} with {team.team_name}. Recorded coral health is {reef.coral_health}%. '
    story = [OceanSentinelLogo(), Spacer(1, 8 * mm), Paragraph('Mission Operations Report', styles['Title']), Paragraph(f'Generated: {generated_date}', styles['BodyText']), Spacer(1, 6 * mm), Paragraph('Reef Details', styles['Heading2']), _detail_table([('Reef', reef.reef_name), ('Country', reef.country), ('Coordinates', f'{reef.latitude}, {reef.longitude}'), ('Coral health', f'{reef.coral_health}%'), ('Sea temperature', f'{reef.sea_temperature}°C'), ('Protected area', 'Yes' if reef.protected_area else 'No')]), Spacer(1, 5 * mm), Paragraph('Mission Details', styles['Heading2']), _detail_table([('Title', mission.title), ('Description', mission.description), ('Priority', mission.priority), ('Mission status', mission.status), ('Scheduled date', mission.scheduled_date), ('Completed date', mission.completed_date)]), Spacer(1, 5 * mm), Paragraph('Team Details', styles['Heading2']), _detail_table([('Team', team.team_name), ('Leader', team.leader_name), ('Specialization', team.specialization), ('Status', team.status), ('Members', team.member_count)]), Spacer(1, 5 * mm), Paragraph('Executive Summary', styles['Heading2']), Paragraph(summary, styles['BodyText'])]
    document.build(story)
