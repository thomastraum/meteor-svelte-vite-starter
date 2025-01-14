FROM zodern/meteor
COPY --chown=app:app ./build/demo.renderer.ai.tar.gz /bundle/bundle.tar.gz


# Install npm dependencies
# RUN cd /built_app/programs/server && npm install

# Set environment variables
# ENV ROOT_URL=http://localhost/
# ENV MONGO_URL="mongodb://localhost:3001/meteor"
# ENV PORT=3000

# # Start the app
# CMD ["node", "/built_app/main.js"]


# 7.0.5