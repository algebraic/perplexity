from django.urls import  path
from movie_app import views

urlpatterns = [
    path('', views.get_movies, name = "get_movies"),
    path('movies/<int:id>/',views.movie_detail, name = "movie_detail")
]