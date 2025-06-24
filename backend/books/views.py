from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status, permissions
from .models import Book
from .serializers import BookSerializer
from django.shortcuts import get_object_or_404
from users.models import User
from rest_framework_simplejwt.authentication import JWTAuthentication
class BookListCreate(APIView):
    permission_classes = [permissions.IsAuthenticated]
    authentication_classes = [JWTAuthentication]

    def get(self, request):
        user_id = request.user['user_id']
        user = User.objects.get(id=user_id)
        books = Book.objects.filter(created_by=user)
        serializer = BookSerializer(books, many=True)
        return Response(serializer.data)

    def post(self, request):
        user_id = request.user['user_id']
        user = User.objects.get(id=user_id)
        serializer = BookSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save(created_by=user)
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class BookUpdate(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def put(self, request, pk):
        book = get_object_or_404(Book, pk=pk, created_by=request.user)
        serializer = BookSerializer(book, data=request.data)
        if serializer.is_valid():
            serializer.save(created_by=request.user)
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class BookDelete(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def delete(self, request, pk):
        book = get_object_or_404(Book, pk=pk, created_by=request.user)
        book.delete()
        return Response({"message": "Book deleted"}, status=status.HTTP_204_NO_CONTENT)
