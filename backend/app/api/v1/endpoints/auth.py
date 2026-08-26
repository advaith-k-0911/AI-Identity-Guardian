"""Authentication endpoints for Registration, Login, Logout, and Current User Profile."""

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from app.core.dependencies import get_current_user
from app.core.security import get_password_hash, verify_password, create_access_token
from app.db.session import get_db
from app.models.entities import UserModel
from app.schemas.findings import APIResponse
from app.schemas.auth import (
    UserRegisterRequest,
    UserLoginRequest,
    UserResponse,
    TokenResponse,
)

router = APIRouter(prefix="/auth", tags=["Authentication"])


@router.post(
    "/register",
    response_model=APIResponse[TokenResponse],
    status_code=status.HTTP_201_CREATED,
    summary="Register a new user",
    description="Creates a new user account with secure password hashing and returns an access token.",
)
async def register(
    request: UserRegisterRequest,
    db: Session = Depends(get_db),
):
    """Register a new user account."""
    existing_user = db.query(UserModel).filter(UserModel.email == request.email.lower().strip()).first()
    if existing_user:
        # Generic message prevents email enumeration attacks
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Registration could not be completed.",
        )

    # Hash password securely
    hashed_pwd = get_password_hash(request.password)

    new_user = UserModel(
        email=request.email.lower().strip(),
        hashed_password=hashed_pwd,
        full_name=request.full_name.strip() if request.full_name else None,
        is_active=True,
    )
    db.add(new_user)
    db.commit()
    db.refresh(new_user)

    # Issue JWT token
    access_token = create_access_token(subject=new_user.id)

    user_resp = UserResponse(
        id=new_user.id,
        email=new_user.email,
        full_name=new_user.full_name,
        created_at=new_user.created_at,
        is_active=new_user.is_active,
    )

    return APIResponse(
        success=True,
        data=TokenResponse(
            access_token=access_token,
            token_type="bearer",
            user=user_resp,
        ),
        message="User registered successfully.",
    )


@router.post(
    "/login",
    response_model=APIResponse[TokenResponse],
    status_code=status.HTTP_200_OK,
    summary="Authenticate user",
    description="Validates credentials and returns an access token.",
)
async def login(
    request: UserLoginRequest,
    db: Session = Depends(get_db),
):
    """Authenticate with email and password."""
    user = db.query(UserModel).filter(UserModel.email == request.email.lower().strip()).first()
    if not user or not verify_password(request.password, user.hashed_password):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect email or password.",
            headers={"WWW-Authenticate": "Bearer"},
        )

    if not user.is_active:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="User account is deactivated.",
        )

    access_token = create_access_token(subject=user.id)

    user_resp = UserResponse(
        id=user.id,
        email=user.email,
        full_name=user.full_name,
        created_at=user.created_at,
        is_active=user.is_active,
    )

    return APIResponse(
        success=True,
        data=TokenResponse(
            access_token=access_token,
            token_type="bearer",
            user=user_resp,
        ),
        message="Authentication successful.",
    )


@router.post(
    "/logout",
    response_model=APIResponse[dict],
    status_code=status.HTTP_200_OK,
    summary="Logout user",
    description="Terminates client session.",
)
async def logout():
    """Client logout confirmation."""
    return APIResponse(
        success=True,
        data={"message": "Logged out successfully."},
        message="Session terminated.",
    )


@router.get(
    "/me",
    response_model=APIResponse[UserResponse],
    status_code=status.HTTP_200_OK,
    summary="Get current user profile",
    description="Returns profile details for the currently authenticated user.",
)
async def get_me(
    current_user: UserModel = Depends(get_current_user),
):
    """Fetch current user profile."""
    return APIResponse(
        success=True,
        data=UserResponse(
            id=current_user.id,
            email=current_user.email,
            full_name=current_user.full_name,
            created_at=current_user.created_at,
            is_active=current_user.is_active,
        ),
        message="Profile retrieved successfully.",
    )
