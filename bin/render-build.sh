#!/usr/bin/env bash

# exit on error
set -o errexit

bundle install
# comment out if not migrating or reseeding
rails db:migrate
rails db:seed
