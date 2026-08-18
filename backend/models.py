from sqlalchemy import Column, Integer, String, Boolean, ForeignKey, Date, Float, Text, DateTime
from sqlalchemy.orm import relationship
from database import Base
import datetime

class Role(Base):
    __tablename__ = "roles"
    id, nom_role = Column(Integer, primary_key=True, index=True), Column(String, unique=True, index=True)
    users = relationship("User", back_populates="role")

class Center(Base):
    __tablename__ = "centers"
    id, nom_centre = Column(Integer, primary_key=True, index=True), Column(String, unique=True, index=True)
    profiles, activities = relationship("Profile", back_populates="center"), relationship("Activity", back_populates="center")

class Specialty(Base):
    __tablename__ = "specialties"
    id, nom_specialite = Column(Integer, primary_key=True, index=True), Column(String, unique=True, index=True)
    profiles = relationship("Profile", back_populates="specialty")

class ActivityType(Base):
    __tablename__ = "activity_types"
    id, nom_type, est_neutralise = Column(Integer, primary_key=True, index=True), Column(String, unique=True), Column(Boolean, default=False)
    activities = relationship("Activity", back_populates="activity_type")

class Program(Base):
    __tablename__ = "programs"
    id, nom_programme = Column(Integer, primary_key=True, index=True), Column(String, unique=True)
    activities = relationship("Activity", back_populates="program")

class Client(Base):
    __tablename__ = "clients"
    id, nom_client = Column(Integer, primary_key=True, index=True), Column(String, unique=True)
    activities = relationship("Activity", back_populates="client")

class User(Base):
    __tablename__ = "users"
    id, employee_id, email = Column(Integer, primary_key=True, index=True), Column(String, unique=True, index=True), Column(String, unique=True, index=True)
    password_hash, role_id, is_active = Column(String), Column(Integer, ForeignKey("roles.id")), Column(Boolean, default=True)
    reset_token, reset_token_expires = Column(String, nullable=True), Column(DateTime, nullable=True)
    two_factor_code, two_factor_expires = Column(String, nullable=True), Column(DateTime, nullable=True)
    role, profile = relationship("Role", back_populates="users"), relationship("Profile", back_populates="user", uselist=False, foreign_keys="[Profile.user_id]")
    weekly_declarations, activities = relationship("WeeklyDeclaration", back_populates="user"), relationship("Activity", back_populates="trainer")
    unavailability_periods, leaves, capacity_targets = relationship("UnavailabilityPeriod", back_populates="user"), relationship("Leave", back_populates="user"), relationship("CapacityTarget", back_populates="user")

class Profile(Base):
    __tablename__ = "profiles"
    id, user_id = Column(Integer, primary_key=True, index=True), Column(Integer, ForeignKey("users.id"), unique=True)
    first_name, last_name, job_title = Column(String), Column(String), Column(String, nullable=True)
    home_center_id, specialty_id = Column(Integer, ForeignKey("centers.id")), Column(Integer, ForeignKey("specialties.id"))
    hire_date, manager_id, phone, bio = Column(Date, nullable=True), Column(Integer, ForeignKey("users.id"), nullable=True), Column(String, nullable=True), Column(String, nullable=True)
    user, manager = relationship("User", foreign_keys=[user_id], back_populates="profile"), relationship("User", foreign_keys=[manager_id])
    center, specialty = relationship("Center", back_populates="profiles"), relationship("Specialty", back_populates="profiles")

class WeeklyDeclaration(Base):
    __tablename__ = "weekly_declarations"
    id, user_id = Column(Integer, primary_key=True, index=True), Column(Integer, ForeignKey("users.id"))
    year, week_number, status = Column(Integer), Column(Integer), Column(String)
    user, activities = relationship("User", back_populates="weekly_declarations"), relationship("Activity", back_populates="weekly_declaration")

class Activity(Base):
    __tablename__ = "activities"
    id, weekly_declaration_id, trainer_id = Column(Integer, primary_key=True, index=True), Column(Integer, ForeignKey("weekly_declarations.id"), nullable=True), Column(Integer, ForeignKey("users.id"))
    activity_type_id, program_id, client_id, center_id = Column(Integer, ForeignKey("activity_types.id")), Column(Integer, ForeignKey("programs.id"), nullable=True), Column(Integer, ForeignKey("clients.id"), nullable=True), Column(Integer, ForeignKey("centers.id"))
    activity_date, duration_days, status, comment, attachment_id = Column(Date), Column(Float), Column(String), Column(Text, nullable=True), Column(Integer, nullable=True)
    weekly_declaration, trainer = relationship("WeeklyDeclaration", back_populates="activities"), relationship("User", back_populates="activities")
    activity_type, program, client, center = relationship("ActivityType", back_populates="activities"), relationship("Program", back_populates="activities"), relationship("Client", back_populates="activities"), relationship("Center", back_populates="activities")
    validation_history = relationship("ValidationHistory", back_populates="activity")

class ValidationHistory(Base):
    __tablename__ = "validation_history"
    id, activity_id, author_id = Column(Integer, primary_key=True, index=True), Column(Integer, ForeignKey("activities.id")), Column(Integer, ForeignKey("users.id"))
    old_status, new_status, modification_date = Column(String), Column(String), Column(DateTime, default=datetime.datetime.utcnow)
    activity, author = relationship("Activity", back_populates="validation_history"), relationship("User")

class UnavailabilityPeriod(Base):
    __tablename__ = "unavailability_periods"
    id, user_id = Column(Integer, primary_key=True, index=True), Column(Integer, ForeignKey("users.id"))
    unavailability_type, start_date, end_date, coefficient = Column(String), Column(Date), Column(Date), Column(Float)
    user = relationship("User", back_populates="unavailability_periods")

class CalendarExclusion(Base):
    __tablename__ = "calendar_exclusions"
    id, exclusion_type, start_date, end_date, coefficient = Column(Integer, primary_key=True, index=True), Column(String), Column(Date), Column(Date), Column(Float)

class WeekCoefficient(Base):
    __tablename__ = "week_coefficients"
    id, week_number = Column(Integer, primary_key=True, index=True), Column(Integer, unique=True, index=True)
    period_label, coefficient, is_blocked = Column(String, nullable=False), Column(Float, nullable=False, default=1.0), Column(Integer, default=0)

class CapacityTarget(Base):
    __tablename__ = "capacity_targets"
    id, user_id, year = Column(Integer, primary_key=True, index=True), Column(Integer, ForeignKey("users.id")), Column(Integer)
    target_capacity_days, available_capacity_days = Column(Float), Column(Float)
    user = relationship("User", back_populates="capacity_targets")

class Leave(Base):
    __tablename__ = "leaves"
    id, user_id, leave_type = Column(Integer, primary_key=True, index=True), Column(Integer, ForeignKey("users.id")), Column(String)
    start_date, end_date, status = Column(Date), Column(Date), Column(String)
    user = relationship("User", back_populates="leaves")

class PlanningSession(Base):
    __tablename__ = "planning_sessions"
    id, title, trainer_name = Column(String, primary_key=True, index=True), Column(String, nullable=False), Column(String, nullable=False)
    trainer_domain, center, start_date, end_date = Column(String, nullable=False), Column(String, nullable=False), Column(String, nullable=False), Column(String, nullable=False)
    duration_days, status, room, co_trainer_name = Column(Integer, nullable=False), Column(String, nullable=False, default="SCHEDULED"), Column(String, nullable=True), Column(String, nullable=True)
