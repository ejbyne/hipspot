#hipSpot

Final Project at Makers Academy

[![Code
Climate](https://codeclimate.com/github/ejbyne/hipspot/badges/gpa.svg)](https://codeclimate.com/github/ejbyne/hipspot) [![Test
Coverage](https://codeclimate.com/github/ejbyne/hipspot/badges/coverage.svg)](https://codeclimate.com/github/ejbyne/hipspot)

[Link to Final Product](http://hipspot.uk/)

###Brief

Our cohort has been split into groups and each assigned a two week project of our
preference to complete and present on
Friday 30th January. Our team consists of: [Ed
Byne](https://github.com/ejbyne), [Ming Chan](https://github.com/ming-chan),
[Mishal Islam](https://github.com/mishal1) and [Nick
Dyer](https://github.com/nickbdyer).

Technologies are not specified within the brief - they must be decided upon by
the teams based on the merits of
each technology for the project.

###Development Stages

Our team started with an original concept of a 'Mobile Tour App', designed to
assist people who are new to a city, to find and discover information about
nearby points of interest. 

Subsequent SCRUMS and consultations with coaches revealed that the initial
concept was flawed. A combination of pre-existing apps in the market, together
with an unclear client base and a lack of content without reliance on the
Wikipedia API, brought us to a decision to pivot.

It occurred to us that one of the hardest thing to get right in a new city, is
truly getting involved in the local culture, and avoid the tourist hotspots.
Eat where the locals eat, rather than where the tourists typically end up. This
idea led us to the idea of determining whether a venue was popular or not.

###Methodology

We started with a concept around a person looking for a place to go out. We
wanted to produce something that could let that person know about popular
places near them. Our story board looked like this:

![alt text](images/userstory.JPG
"User Story Board")

During our pivot sequence we discovered that combining the google places API
and twitter streaming API we could show the "popularity" of a venue based on
the number of tweets eminating from it. Since we were consuming APIs we decided
to use a Javascript stack in order to keep JSON objects moving easily
throughout the stack. 

Our team had two daily SCRUMs one in the morning, and one after lunch. During
these meetings we discussed progress made, plans moving forward, changes needing
consideration and updates required to our tracker. 

We worked in pairs for most of the project, although during particularly
fundamental parts of the project we worked together as a four so that the knowledge was
shared. For example during initial setup of the google map. 

During our early pivoting sequence, we determined that the Twitter Public API
had a limitation in that queries would only ever return 100 tweets, and were
subject to rate limiting. For that reason, we decided that we would instead
record the Twitter Streaming API to file and make our own database of data. To
get that process started quickly, we recorded tweets straight to .txt files on
a day by day basis. 

We quickly found that only 6 or so hours of tweets gave us a file of about
120MB. About half of which didn't contain accurate geoJSON information so
needed to be excluded. NodeJS readStreams offered us a very efficient way of
reading from a file, however, we knew that if the data could be sorted in
a database, we could make use of indexing technologies to improve the response
time of specific queries. We opted for MongoDB since it allow the JSON objects
from the APIs to be stored natively.

We benchmarked reading data back from MongoDB against reading from our .txt
files and the improvement in response time was a factor of 3.

Our fully technology stack is presented here:

| Project                                     | Technologies | Testing  | Misc                  |
|---------------------------------------------|--------------|----------|-----------------------|
| [Github](https://github.com/ejbyne/hipspot) | MongoDB      | Mocha    | Grunt                 |
| [EC2](http://www.hipspot.uk/)               | ExpressJS    | CasperJS | Google Places API     |
|                                             | Javascript   | Chai     | Twitter Streaming API |
|                                             | NodeJS       | Hippie   | AWS EC2               |
|                                             | JQuery       | Jasmine  | Ubuntu Server         |
|                                             | HTML         | JSHint   |                       |
|                                             | CSS          | Istanbul |                       |
|                                             | Foundation   |          |                       |


###Images

Pivotal Tracker Initial Setup

![alt text](images/v1 Pivotal.png
"Pivotal Tracker")

![alt text](images/v2 Pivotal.png
"Pivotal Tracker in Progress")

![alt text](images/v3 Pivotal.png
"Pivotal Tracker in Progress")

###Usage Instructions 

#####Clone the Project

Using either

######SSH

```sh
$ git clone git@github.com:ejbyne/hipspot.git
```
Or

######HTTPS
```sh
$ git clone https://github.com/ejbyne/hipspot.git
```
#####Open the Directory

```sh
$ cd hipspot
```

#####Run the Testing Suite

```sh
$ npm install
$ grunt
```

#####Run the Project

```sh
$ npm start
```

Visit the webpage [http://localhost:4000](http://localhost:4000/) in your
browser.

###Improvements

If we were to develop this further, we would be interested to explore some of
the following:

- Introducing a larger data set, to see if correlation improves.
- Analyse the sentiment of individual tweets to determine if they are enjoing
  themselves in the venue they are at. 
- Introduce recommendations from the App on places to go based correlation
  between tweets and venues.
- Analyse trends in movement of twitter users over time. 


