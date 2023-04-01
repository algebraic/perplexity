from django.db import models

# Create your models here.
class Movie(models.Model):
    name = models.CharField(max_length=50, blank = True, null = True)
    release_date = models.DateField()
    image_url = models.CharField(max_length=10, blank = True, null = True)

    def __str__(self):
        return self.name