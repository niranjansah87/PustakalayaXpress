from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from .models import Book
from .serializers import BookSerializer
from django.shortcuts import get_object_or_404
from .utils import get_user_from_token

class BookListCreate(APIView):
    def get(self, request):
        user = get_user_from_token(request)
        if not user:
            return Response({'detail': 'Unauthorized'}, status=401)

        books = Book.objects.filter(created_by=user)
        serializer = BookSerializer(books, many=True)
        return Response(serializer.data)

    def post(self, request):
        user = get_user_from_token(request)
        if not user:
            return Response({'detail': 'Unauthorized'}, status=401)

        serializer = BookSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save(created_by=user)
            return Response(serializer.data, status=201)
        return Response(serializer.errors, status=400)

class BookUpdate(APIView):
    def put(self, request, pk):
        user = get_user_from_token(request)
        if not user:
            return Response({'detail': 'Unauthorized'}, status=401)

        book = get_object_or_404(Book, pk=pk, created_by=user)
        serializer = BookSerializer(book, data=request.data)
        if serializer.is_valid():
            serializer.save(created_by=user)
            return Response(serializer.data)
        return Response(serializer.errors, status=400)

class BookDelete(APIView):
    def delete(self, request, pk):
        user = get_user_from_token(request)
        if not user:
            return Response({'detail': 'Unauthorized'}, status=status.HTTP_401_UNAUTHORIZED)

        book = get_object_or_404(Book, pk=pk, created_by=user)
        book.delete()
        return Response({'message': 'Book deleted successfully'}, status=status.HTTP_200_OK)


class BookListByUser(APIView):
    def get(self, request, user_id):
        user = get_user_from_token(request)
        if not user or user.id != user_id:
            return Response({'detail': 'Unauthorized'}, status=status.HTTP_401_UNAUTHORIZED)

        books = Book.objects.filter(created_by=user)
        serializer = BookSerializer(books, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)




class BookDetail(APIView):
    def get(self, request, pk):
        user = get_user_from_token(request)
        if not user:
            return Response({'detail': 'Unauthorized'}, status=status.HTTP_401_UNAUTHORIZED)

        book = get_object_or_404(Book, pk=pk, created_by=user)
        serializer = BookSerializer(book)
        return Response(serializer.data, status=status.HTTP_200_OK)
