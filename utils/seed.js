const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Movie = require('./models/Movie');
const User = require('./models/User');

dotenv.config();

const movies = [
    {
        title: "Inception",
        description: "A thief who steals corporate secrets through the use of dream-sharing technology is given the inverse task of planting an idea into the mind of a C.E.O.",
        poster: "https://image.tmdb.org/t/p/w500/9gk7adHYeDvHkCSEqAvQNLV5Uge.jpg",
        genre: ["Sci-Fi", "Action", "Thriller"],
        director: "Christopher Nolan",
        cast: ["Leonardo DiCaprio", "Joseph Gordon-Levitt", "Elliot Page"],
        releaseDate: new Date("2010-07-16"),
        isTrending: true,
        affiliateLinks: { netflix: "https://www.netflix.com", amazon: "https://www.amazon.com/Prime-Video" }
    },
    {
        title: "The Dark Knight",
        description: "When the menace known as the Joker wreaks havoc and chaos on the people of Gotham, Batman must accept one of the greatest psychological and physical tests of his ability to fight injustice.",
        poster: "https://image.tmdb.org/t/p/w500/qJ2tW6WMUDux911r6m7haRef0WH.jpg",
        genre: ["Action", "Drama", "Thriller"],
        director: "Christopher Nolan",
        cast: ["Christian Bale", "Heath Ledger", "Aaron Eckhart"],
        releaseDate: new Date("2008-07-18"),
        isTrending: true,
        affiliateLinks: { netflix: "https://www.netflix.com", amazon: "https://www.amazon.com/Prime-Video" }
    },
    {
        title: "Interstellar",
        description: "A team of explorers travel through a wormhole in space in an attempt to ensure humanity's survival.",
        poster: "https://image.tmdb.org/t/p/w500/gEU2QniE6E77NI6lCU6MxlNBvIx.jpg",
        genre: ["Sci-Fi", "Drama", "Action"],
        director: "Christopher Nolan",
        cast: ["Matthew McConaughey", "Anne Hathaway", "Jessica Chastain"],
        releaseDate: new Date("2014-11-07"),
        isTrending: true,
        affiliateLinks: { amazon: "https://www.amazon.com/Prime-Video" }
    },
    {
        title: "The Shawshank Redemption",
        description: "Two imprisoned men bond over a number of years, finding solace and eventual redemption through acts of common decency.",
        poster: "https://image.tmdb.org/t/p/w500/lyQBXzOQSuE59IsHyhrp0qIiPAz.jpg",
        genre: ["Drama"],
        director: "Frank Darabont",
        cast: ["Tim Robbins", "Morgan Freeman"],
        releaseDate: new Date("1994-09-23"),
        isTrending: false,
    },
    {
        title: "Pulp Fiction",
        description: "The lives of two mob hitmen, a boxer, a gangster and his wife, and a pair of diner bandits intertwine in four tales of violence and redemption.",
        poster: "https://image.tmdb.org/t/p/w500/d5iIlFn5s0ImszYzBPb8JPIfbXD.jpg",
        genre: ["Thriller", "Drama"],
        director: "Quentin Tarantino",
        cast: ["John Travolta", "Uma Thurman", "Samuel L. Jackson"],
        releaseDate: new Date("1994-10-14"),
        isTrending: false,
    },
    {
        title: "The Godfather",
        description: "The aging patriarch of an organized crime dynasty transfers control of his clandestine empire to his reluctant son.",
        poster: "https://image.tmdb.org/t/p/w500/3bhkrj58Vtu7enYsLegHnDmni2.jpg",
        genre: ["Drama", "Thriller"],
        director: "Francis Ford Coppola",
        cast: ["Marlon Brando", "Al Pacino", "James Caan"],
        releaseDate: new Date("1972-03-24"),
        isTrending: false,
    },
    {
        title: "Avengers: Endgame",
        description: "After the devastating events of Infinity War, the Avengers assemble once more in order to reverse Thanos' actions and restore balance to the universe.",
        poster: "https://image.tmdb.org/t/p/w500/or06FN3Dka5tukK1e9sl16pB3iy.jpg",
        genre: ["Action", "Sci-Fi"],
        director: "Anthony Russo, Joe Russo",
        cast: ["Robert Downey Jr.", "Chris Evans", "Mark Ruffalo"],
        releaseDate: new Date("2019-04-26"),
        isTrending: true,
        affiliateLinks: { amazon: "https://www.amazon.com/Prime-Video" }
    },
    {
        title: "Parasite",
        description: "Greed and class discrimination threaten the newly formed symbiotic relationship between the wealthy Park family and the destitute Kim clan.",
        poster: "https://image.tmdb.org/t/p/w500/7IiTTgloJzvGI1TAYymCfbfl3vT.jpg",
        genre: ["Thriller", "Drama"],
        director: "Bong Joon-ho",
        cast: ["Song Kang-ho", "Lee Sun-kyun", "Cho Yeo-jeong"],
        releaseDate: new Date("2019-05-30"),
        isTrending: false,
    },
    {
        title: "Get Out",
        description: "A young African-American visits his white girlfriend's parents for the weekend, where his simmering uneasiness about their reception of him eventually reaches a boiling point.",
        poster: "https://image.tmdb.org/t/p/w500/tFXcEccSQMf3lfhfXKSU9iRBpa3.jpg",
        genre: ["Horror", "Thriller"],
        director: "Jordan Peele",
        cast: ["Daniel Kaluuya", "Allison Williams"],
        releaseDate: new Date("2017-02-24"),
        isTrending: false,
    },
    {
        title: "Spider-Man: Into the Spider-Verse",
        description: "Teen Miles Morales becomes the Spider-Man of his universe, and must join with five spider-powered individuals from other dimensions to stop a threat for all realities.",
        poster: "https://image.tmdb.org/t/p/w500/iiZZdoQBEYBv6id8su7ImL0oCbD.jpg",
        genre: ["Animation", "Action", "Sci-Fi"],
        director: "Bob Persichetti, Peter Ramsey",
        cast: ["Shameik Moore", "Jake Johnson", "Hailee Steinfeld"],
        releaseDate: new Date("2018-12-14"),
        isTrending: true,
        affiliateLinks: { netflix: "https://www.netflix.com" }
    },
];

const seedDB = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log('Connected to MongoDB');

        await Movie.deleteMany({});
        await User.deleteMany({});
        console.log('Cleared existing data');

        await Movie.insertMany(movies);
        console.log(`Seeded ${movies.length} movies`);

        // Create admin user
        await User.create({
            username: 'admin',
            email: 'admin@cinerate.com',
            password: 'admin123',
            role: 'admin'
        });
        console.log('Created admin user: admin@cinerate.com / admin123');

        // Create test user
        await User.create({
            username: 'testuser',
            email: 'user@cinerate.com',
            password: 'user123',
            role: 'user'
        });
        console.log('Created test user: user@cinerate.com / user123');

        console.log('\n✅ Database seeded successfully!');
        process.exit(0);
    } catch (err) {
        console.error('Seeding error:', err);
        process.exit(1);
    }
};

seedDB();
