# This file should contain all the record creation needed to seed the database with its default values.
# The data can then be loaded with the bin/rails db:seed command (or created alongside the database with db:setup).
#
# Examples:
#
#   movies = Movie.create([{ name: "Star Wars" }, { name: "Lord of the Rings" }])
#   Character.create(name: "Luke", movie: movies.first)

ApplicationRecord.transaction do
  puts "Destroying tables..."
  # Unnecessary if using `rails db:seed:replant`
  Review.destroy_all
  Bench.destroy_all
  User.destroy_all

  puts "Resetting primary keys..."
  # For easy testing, so that after seeding, the first `User` has `id` of 1
  %w(users benches reviews).each do |table_name|
    ApplicationRecord.connection.reset_pk_sequence!(table_name)
  end

  puts "Creating users..."
  # Create one user with an easy to remember username, email, and password:
  User.create!(
    username: 'Demo-lition', 
    email: 'demo@user.io', 
    password: 'password'
  )

  # More users
  users = 10.times.map do
    User.create!({
      username: Faker::Internet.unique.username(specifier: 3),
      email: Faker::Internet.unique.email,
      password: 'password'
    }) 
  end

  puts "Creating benches..."
  random_description = proc { Faker::Lorem.paragraphs(number: rand(1..3)).join("\n\n") }

  benches = Bench.create!([
    {
      title: 'Alamo square',
      description: random_description.call,
      seating: 4,
      price: 104,
      lat: 37.775769,
      lng: -122.434960
    },
    {
      title: 'UN plaza',
      description: random_description.call,
      seating: 2,
      price: 58,
      lat: 37.779760,
      lng: -122.413820
    },
    {
      title: 'Ocean beach',
      description: random_description.call,
      seating: 3,
      price: 97,
      lat: 37.769996,
      lng: -122.511281
    }
  ])

  benches.each do |bench|
    users.sample(rand(2..4)).each do |user|
      Review.create!(
        body: Faker::Lorem.sentences(number: rand(1..3)).join(' '),
        rating: rand(1..5),
        bench: bench,
        author: user
      )
    end
  end
end

puts "Attaching photos..."
Bench.first(3).each_with_index do |bench, index|
  bench.photo.attach(
    io: File.open(Rails.root.join("db/seed_assets/bench_#{index + 1}.jpg")), 
    filename: "bench_#{index + 1}.jpg"
  )
end

puts "Done!"
