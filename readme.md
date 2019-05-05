#### Update Jekyll and gems

Change the Jekyll version in file `Gemfile`, then run:

```
bundle update jekyll
bundle install
```

Or use the flag `--path vendor/bundle` to install gems relative to the current directory:

```
bundle install --path vendor/bundle
```

Note, add `vendor/bundle` to `.gitignore`.

#### Run Jekyll

```
bundle exec jekyll serve
```