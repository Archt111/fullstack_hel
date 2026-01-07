For this exercise's hypothetical scenario, a team of six people are developing an application using purely Python. 

### 1. CI steps
- For linting, there are tools such as Pylint and Flake8. These tools are used to enforce coding standards, detect errors, and improve code quality across the team. 

- For testing, pytest and robot framwork are common tools, with the latter one having lower learning curve.

- For building, we would use Poetry or uv to manage dependencies and package the application. After that we can use Docker to build an image for deployment.

### 2. CI/CD alternatives
Aside from Jenkins and GitHub Actions, there are also alternatives like GitLab CI if the code is hosted on GitLab. CircleCI is another strong option known for its speed and easy configuration. For teams using the Atlassian suite, Bitbucket Pipelines would be a logical integrated choice.

### 3. Hosting environment
For a team of six developers, both options can be a choice. We would choose self-hosting env if there are specific requirements in terms of data privacy or specialised hardware; or simply there are resources in the team to do so. Otherwise, cloud-based CI environment is the better choice to go with.