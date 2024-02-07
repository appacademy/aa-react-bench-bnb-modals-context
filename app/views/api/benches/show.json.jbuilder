json.bench do
  json.partial! '/api/benches/bench', bench: @bench
end

@bench.reviews.includes(:author).each do |review|
  json.reviews do
    json.set! review.id do
      json.partial! '/api/reviews/review', review: review
    end
  end

  json.users do
    json.set! review.author_id do
      json.partial! '/api/users/user', user: review.author
    end
  end
end
