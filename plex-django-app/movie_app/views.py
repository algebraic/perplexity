import requests
# Create your views here.
from django.shortcuts import render

from movie_app.models import Movie


def get_movies(request):
    # zj: replace this with moviedb shiz
    all_movies = [] #empty array

    if 'name' in request.GET:
        name = request.GET['name']

        url = ("https://api.themoviedb.org/3/search/movie?api_key=ce283f8ff68c019530c5f5ccf045de2d&query="+str(name).replace(" ", "+"))

        response = requests.get(url)
        movielist = response.json()
        print(movielist)
        print("### list size: " + str(movielist["total_results"]))
        for i in movielist["results"]:
            print(i["title"] + " (" + i["release_date"] + ")" + "  (" + i["poster_path"])
            movie_data = Movie(
                name=i['title'],
                year=i['release_date'],
                img_url=i['poster_path']
            )
            all_movies.append(movie_data)
            # movie_data.save()
            # all_movies = Movie.objects.all().order_by('-id')

    return render(request, 'movies/movie.html', {"all_movies": all_movies})

def movie_detail(request, id):
    movie = Movie.objects.get(id = id)
    print(movie)
    return render (
        request,
        'movies/movie_detail.html',
        {'movie': movie}
    )
