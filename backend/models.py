from sqlalchemy import Column, Integer, String, Boolean, ForeignKey, Date, Float, Text, DateTime
from sqlalchemy.orm import relationship
from database import Base
import datetime

class Role(Base):
    __tablename__ = "roles"
    id = Column(Integer, primary_key=True, index=True)
    nom_role = Column(String, unique=True, index=True)
    users = relationship("User", back_populates="role")

class Center(Base):
    __tablename__ = "centers"
    id = Column(Integer, primary_key=True, index=True)
    nom_centre = Column(String, unique=True, index=True)
    profiles = relationship("Profile", back_populates="center")
    activities = relationship("Activity", back_populates="center")

class Specialty(Base):
    __tablename__ = "specialties"
    id = Column(Integer, primary_key=True, index=True)
    nom_specialite = Column(String, unique=True, index=True)
    profiles = relationship("Profile", back_populates="specialty")

class ActivityType(Base):
    __tablename__ = "activity_types"
    id = Column(Integer, primary_key=True, index=True)
    nom_type = Column(String, unique=True)
    est_neutralise = Column(Boolean, default=False)
    activities = relationship("Activity", back_populates="activity_type")

class Program(Base):
    __tablename__ = "programs"
    id = Column(Integer, primary_key=True, index=True)
    nom_programme = Column(String, unique=True)
    activities = relationship("Activity", back_populates="program")

class Client(Base):
    __tablename__ = "clients"
    id = Column(Integer, primary_key=True, index=True)
    nom_client = Column(String, unique=True)
    activities = relationship("Activity", back_populates="client")

class User(Base):
    __tablename__ = "users"
    id = Column(Integer, primary_key=True, index=True)
    employee_id = Column(String, unique=True, index=True)
    email = Column(String, unique=True, index=True)
    password_hash = Column(String)
    role_id = Column(Integer, ForeignKey("roles.id"))
    is_active = Column(Boolean, default=True)
    role = relationship("Role", back_populates="users")
    profile = relationship("Profile", back_populates="user", uselist=False, foreign_keys="[Profile.user_id]")
    weekly_declarations = relationship("WeeklyDeclaration", back_populates="user")
    activities = relationship("Activity", back_populates="trainer")
    unavailability_periods = relationship("UnavailabilityPeriod", back_populates="user")
    leaves = relationship("Leave", back_populates="user")
    capacity_targets = relationship("CapacityTarget", back_populates="user")

class Profile(Base):
    __tablename__ = "profiles"
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), unique=True)
    first_name = Column(String)
    last_name = Column(String)
    job_title = Column(String, nullable=True)
    home_center_id = Column(Integer, ForeignKey("centers.id"))
    specialty_id = Column(Integer, ForeignKey("specialties.id"))
    hire_date = Column(Date, nullable=True)
    manager_id = Column(Integer, ForeignKey("users.id"), nullable=True)
    user = relationship("User", foreign_keys=[user_id], back_populates="profile")
    manager = relationship("User", foreign_keys=[manager_id])
    center = relationship("Center", back_populates="profiles")
    specialty = relationship("Specialty", back_populates="profiles")

class WeeklyDeclaration(Base):
    __tablename__ = "weekly_declarations"
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"))
    year = Column(Integer)
    week_number = Column(Integer)
    status = Column(String)
    user = relationship("User", back_populates="weekly_declarations")
    activities = relationship("Activity", back_populates="weekly_declaration")

class Activity(Base):
    __tablename__ = "activities"
    id = Column(Integer, primary_key=True, index=True)
    weekly_declaration_id = Column(Integer, ForeignKey("weekly_declarations.id"), nullable=True)
    trainer_id = Column(Integer, ForeignKey("users.id"))
    activity_type_id = Column(Integer, ForeignKey("activity_types.id"))
    program_id = Column(Integer, ForeignKey("programs.id"), nullable=True)
    client_id = Column(Integer, ForeignKey("clients.id"), nullable=True)
    center_id = Column(Integer, ForeignKey("centers.id"))
    activity_date = Column(Date)
    duration_days = Column(Float)
    status = Column(String)
    comment = Column(Text, nullable=True)
    attachment_id = Column(Integer, nullable=True)
    weekly_declaration = relationship("WeeklyDeclaration", back_populates="activities")
    trainer = relationship("User", back_populates="activities")
    activity_type = relationship("ActivityType", back_populates="activities")
    program = relationship("Program", back_populates="activities")
    client = relationship("Client", back_populates="activities")
    center = relationship("Center", back_populates="activities")
    validation_history = relationship("ValidationHistory", back_populates="activity")

class ValidationHistory(Base):
    __tablename__ = "validation_history"
    id = Column(Integer, primary_key=True, index=True)
    activity_id = Column(Integer, ForeignKey("activities.id"))
    author_id = Column(Integer, ForeignKey("users.id"))
    old_status = Column(String)
    new_status = Column(String)
    modification_date = Column(DateTime, default=datetime.datetime.utcnow)
    activity = relationship("Activity", back_populates="validation_history")
    author = relationship("User")

class UnavailabilityPeriod(Base):
    __tablename__ = "unavailability_periods"
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"))
    unavailability_type = Column(String)
    start_date = Column(Date)
    end_date = Column(Date)
    coefficient = Column(Float)
    user = relationship("User", back_populates="unavailability_periods")

class CalendarExclusion(Base):
    __tablename__ = "calendar_exclusions"
    id = Column(Integer, primary_key=True, index=True)
    exclusion_type = Column(String)
    start_date = Column(Date)
    end_date = Column(Date)
    coefficient = Column(Float)

class WeekCoefficient(Base):
    __tablename__ = "week_coefficients"

    id = Column(Integer, primary_key=True, index=True)
    week_number = Column(Integer, unique=True, index=True)
    period_label = Column(String, nullable=False)
    coefficient = Column(Float, nullable=False, default=1.0)
    is_blocked = Column(Integer, default=0)

class CapacityTarget(Base):
    __tablename__ = "capacity_targets"
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"))
    year = Column(Integer)
    target_capacity_days = Column(Float)
    available_capacity_days = Column(Float)
    user = relationship("User", back_populates="capacity_targets")

class Leave(Base):
    __tablename__ = "leaves"
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"))
    leave_type = Column(String)
    start_date = Column(Date)
    end_date = Column(Date)
    status = Column(String)
    user = relationship("User", back_populates="leaves")
