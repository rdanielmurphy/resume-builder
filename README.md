Resume builder using NodeJS and Pandoc!  Export to HTML, PDF, or Docx.  Ideal for tech resumes.

Modify the data in the resume folder, build then run the docker container, and download the results thru the web browser!

Build docker with:
docker build -t rdanielmurphy/resume-builder-app .

Run docker with:
docker run -p 49160:8082 rdanielmurphy/resume-builder-app
