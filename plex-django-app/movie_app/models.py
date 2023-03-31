from django.db import models

# Create your models here.

class Movie(models.Model):
    name = models.CharField(max_length=50, blank = True, null = True)
    year = models.CharField(max_length=4, blank = True, null = True)
    img_url = models.CharField(max_length=50, blank = True, null = True)

    def __str__(self):
        return self.name