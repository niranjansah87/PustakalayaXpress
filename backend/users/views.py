from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from django.contrib.auth.hashers import check_password
from .models import User
from .serializers import UserSerializer, LoginSerializer
import jwt
from datetime import datetime, timedelta
from django.conf import settings

SECRET_KEY = settings.SECRET_KEY

class RegisterView(APIView):
    def post(self, request):
        serializer = UserSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response({'message': 'User registered successfully'}, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class LoginView(APIView):
    def post(self, request):
        serializer = LoginSerializer(data=request.data)
        if serializer.is_valid():
            email = serializer.validated_data['email']
            password = serializer.validated_data['password']

            try:
                user = User.objects.get(email=email)
            except User.DoesNotExist:
                return Response({'detail': 'User not found'}, status=status.HTTP_404_NOT_FOUND)

            if not check_password(password, user.password):
                return Response({'detail': 'Invalid credentials'}, status=status.HTTP_401_UNAUTHORIZED)

            access_payload = {
                'user_id': user.id,
                'email': user.email,
                'name': user.name,
                'exp': datetime.utcnow() + timedelta(minutes=15),
                'iat': datetime.utcnow()
            }

            refresh_payload = {
                'user_id': user.id,
                'email': user.email,
                'name': user.name,
                'exp': datetime.utcnow() + timedelta(days=7),
                'iat': datetime.utcnow()
            }

            access_token = jwt.encode(access_payload, SECRET_KEY, algorithm='HS256')
            refresh_token = jwt.encode(refresh_payload, SECRET_KEY, algorithm='HS256')

            return Response({
                'access': access_token,
                'refresh': refresh_token
            }, status=200)

        return Response(serializer.errors, status=400)

class LogoutView(APIView):
    def post(self, request):
        
        return Response({"message": "Logged out"}, status=status.HTTP_200_OK)
