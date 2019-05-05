Install bundler if not already present:

```
gem install bundler
```

Install gems and serve the website:

```
bundle install --path vendor/bundle
bundle exec jekyll serve
```

Note, add `vendor/bundle` to `.gitignore`.