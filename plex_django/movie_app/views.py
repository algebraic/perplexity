from urllib import request
from django.http import HttpResponseRedirect
from django.shortcuts import render

# Create your views here.
from django.shortcuts import render
from django.urls import reverse
from movie_app.models import Movie
import requests, dateparser, re

def get_movies(request):
    all_movies = []
    resultsNum = ""

    if request.method == 'POST' and 'run_script' in request.POST:
        # import function to run
        from testscript import msg
        msg()
        # return user to required page
        # return HttpResponseRedirect("/")

    if 'search' in request.GET:
        searchString = request.GET['search']
        yearTest = str(searchString[-4:])
        # if the last 5 characters of search string are " \d{4}" then we have a year also
        if (yearTest.isnumeric()):
            year = yearTest
            title = searchString[:-5]
        else:
            year = ""
            title = searchString

        url = ("https://api.themoviedb.org/3/search/movie?api_key=ce283f8ff68c019530c5f5ccf045de2d&query=" + str(title).replace(" ", "+"))
        if (str(year) != ""):
            url += "&year=" + str(year)

        print(url)
        response = requests.get(url)
        movielist = response.json()
        # print(movielist)
        resultsNum = movielist["total_results"]

        for i in movielist["results"]:
            movie_data = Movie(
                name=i['title'],
                release_date=dateparser.parse(i['release_date']),
                image_url=i["poster_path"]
            )
            all_movies.append(movie_data)
            # movie_data.save()
            # all_movies = Movie.objects.all().order_by('-id')

    return render(request, 'movies/movie.html', {"all_movies": all_movies, "resultsNum": resultsNum})


def movie_detail(request, id):
    movie = Movie.objects.get(id=id)
    print(movie)
    return render(
        request,
        'movies/movie_detail.html',
        {'movie': movie}
    )



def is_movie_or_tvshow(file_name):
    # Replace periods with spaces in the file name
    file_name = file_name.replace('.', ' ')
    # Extract the title and year from the file name using regular expressions
    movie_match = re.match(r'^(.+?)\s*\(\s*(\d{4})\s*\)', file_name)
    tvshow_match = re.match(r'^(.+?)\s*s(\d{1,2})e(\d{1,2})', file_name, re.IGNORECASE)
    # Check if the file name matches the movie or TV show pattern
    if movie_match:
        return True, "Movie", movie_match.group(1), movie_match.group(2)
    elif tvshow_match:
        return True, "TV show", tvshow_match.group(1), f"Season {tvshow_match.group(2)}, Episode {tvshow_match.group(3)}"
    else:
        return False, None, None, None
