
from django.db import models
from django.contrib.auth.models import User

class Book(models.Model):
    book_name = models.CharField(max_length=255)
    author_name = models.CharField(max_length=255)
    publication_name = models.CharField(max_length=255)
    published_date = models.DateField()
    price = models.DecimalField(max_digits=10, decimal_places=2)
    created_by = models.ForeignKey(User, on_delete=models.CASCADE)

    def __str__(self):
        return self.book_name
