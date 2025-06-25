from django.urls import path
from .views import BookListCreate, BookUpdate, BookDelete, BookListByUser,BookDetail

urlpatterns = [
    path('books/', BookListCreate.as_view(), name='book-list-create'),
    path('books/<int:pk>/', BookDetail.as_view(), name='book-detail'),
    path('books/<int:user_id>/', BookListByUser.as_view(), name='book-list-by-user'),
    path('books/<int:pk>/update/', BookUpdate.as_view(), name='book-update'),
    path('books/<int:pk>/delete/', BookDelete.as_view(), name='book-delete'),
]





