// File: lib/data/moviesData.ts
import type { Movie } from "@/lib/types";

/**
 * Films on the Kino tape wall, in the order they fill the wall
 * (left → right, top → bottom). The order is mixed on purpose so the same
 * director or series doesn't land side by side. If the screen has more spots
 * than films, the list loops from the top.
 *
 * To add one: put the poster in /public/movies and add a line, e.g.
 *   { title: "Drive", year: 2011, director: "Nicolas Winding Refn", directorShort: "Refn", poster: "/movies/drive.jpg" },
 */
export const MOVIES: readonly Movie[] = [
    { title: "Interstellar", year: 2014, director: "Christopher Nolan", poster: "/movies/interstellar.jpg" },
    { title: "Parasite", year: 2019, director: "Bong Joon-ho", directorShort: "Bong", poster: "/movies/parasite.jpg" },
    { title: "Spirited Away", year: 2001, director: "Hayao Miyazaki", poster: "/movies/spirited_away.jpg" },
    { title: "Blade Runner 2049", year: 2017, director: "Denis Villeneuve", poster: "/movies/blade_runner_2049.jpg" },
    { title: "The Godfather", year: 1972, director: "Francis Ford Coppola", poster: "/movies/the_godfather.jpg" },
    { title: "Top Gun: Maverick", year: 2022, director: "Joseph Kosinski", poster: "/movies/topgun_maverick.jpg" },
    { title: "Godzilla Minus One", year: 2023, director: "Takashi Yamazaki", poster: "/movies/godzilla_minus_1.jpg" },

    { title: "The Dark Knight", year: 2008, director: "Christopher Nolan", poster: "/movies/the_dark_knight.jpg" },
    { title: "Everything Everywhere All at Once", year: 2022, director: "Daniel Kwan & Daniel Scheinert", directorShort: "Daniels", poster: "/movies/everything_everywhere_all_at_once.jpg" },
    { title: "Saving Private Ryan", year: 1998, director: "Steven Spielberg", poster: "/movies/saving_private_ryan.jpg" },
    { title: "Your Name", year: 2016, director: "Makoto Shinkai", poster: "/movies/your_name.jpg" },
    { title: "Dune", year: 2021, director: "Denis Villeneuve", poster: "/movies/dune.jpg" },
    { title: "Memories of Murder", year: 2003, director: "Bong Joon-ho", directorShort: "Bong", poster: "/movies/memories_of_murder.jpg" },
    { title: "The Truman Show", year: 1998, director: "Peter Weir", poster: "/movies/the_truman_show.jpg" },

    { title: "Sinners", year: 2025, director: "Ryan Coogler", poster: "/movies/sinners.jpg" },
    { title: "Ford v Ferrari", year: 2019, director: "James Mangold", poster: "/movies/ford_vs_ferrari.jpg" },
    { title: "Oppenheimer", year: 2023, director: "Christopher Nolan", poster: "/movies/oppenheimer.jpg" },
    { title: "Grave of the Fireflies", year: 1988, director: "Isao Takahata", poster: "/movies/grave_of_the_fireflies.jpg" },
    { title: "The Wolf of Wall Street", year: 2013, director: "Martin Scorsese", poster: "/movies/the_wolf_of_wallstreet.jpg" },
    { title: "Minari", year: 2020, director: "Lee Isaac Chung", poster: "/movies/minari.jpg" },
    { title: "Avengers: Endgame", year: 2019, director: "Anthony & Joe Russo", directorShort: "Russo Bros", poster: "/movies/avengers_endgame.jpg" },

    { title: "1917", year: 2019, director: "Sam Mendes", poster: "/movies/1917.jpg" },
    { title: "Snowpiercer", year: 2013, director: "Bong Joon-ho", directorShort: "Bong", poster: "/movies/snowpiercer.jpg" },
    { title: "Project Hail Mary", year: 2026, director: "Phil Lord & Christopher Miller", directorShort: "Lord & Miller", poster: "/movies/project_hail_mary.jpg" },
    { title: "Joker", year: 2019, director: "Todd Phillips", poster: "/movies/joker.jpg" },
    { title: "Dune: Part Two", year: 2024, director: "Denis Villeneuve", poster: "/movies/dune_part2.jpg" },
    { title: "Baby Driver", year: 2017, director: "Edgar Wright", poster: "/movies/baby_driver.jpg" },
    { title: "Schindler's List", year: 1993, director: "Steven Spielberg", poster: "/movies/schindlers_list.jpg" },

    { title: "Inception", year: 2010, director: "Christopher Nolan", poster: "/movies/inception.jpg" },
    { title: "Obsession", year: 2025, director: "Curry Barker", poster: "/movies/obsession.jpg" },
    { title: "The Martian", year: 2015, director: "Ridley Scott", poster: "/movies/the_martian.jpg" },
    { title: "Okja", year: 2017, director: "Bong Joon-ho", directorShort: "Bong", poster: "/movies/okja.jpg" },
    { title: "Spider-Man: Brand New Day", year: 2026, director: "Destin Daniel Cretton", poster: "/movies/spiderman_brand_new_day.jpg" },
    { title: "Shutter Island", year: 2010, director: "Martin Scorsese", poster: "/movies/shutter_island.jpg" },
    { title: "F1", year: 2025, director: "Joseph Kosinski", poster: "/movies/f1_movie.jpg" },

    { title: "Dunkirk", year: 2017, director: "Christopher Nolan", poster: "/movies/dunkirk.jpg" },
    { title: "Godzilla Minus Zero", year: 2026, director: "Takashi Yamazaki", poster: "/movies/godzilla_minus_0.jpg" },
    { title: "Mickey 17", year: 2025, director: "Bong Joon-ho", directorShort: "Bong", poster: "/movies/mickey_17.jpg" },
    { title: "The Odyssey", year: 2026, director: "Christopher Nolan", poster: "/movies/the_odyssey.jpg" },
    { title: "The Imitation Game", year: 2014, director: "Morten Tyldum", poster: "/movies/the_imitation_game.jpg" },
];
