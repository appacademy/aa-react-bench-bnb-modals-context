json.review do
  json.partial! '/api/reviews/review', review: @review
end

json.user do
  json.partial! '/api/users/user', user: @review.author
end

json.bench do 
  json.partial! '/api/benches/bench', bench: @review.bench
end
