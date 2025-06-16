FROM ubuntu:25.04

RUN apt-get update \
 && apt-get install -y --no-install-recommends \
      octave \
      gnuplot-nox \
      ca-certificates \
 && rm -rf /var/lib/apt/lists/*

ARG GOTTY_VERSION=1.0.1
ADD https://github.com/yudai/gotty/releases/download/v${GOTTY_VERSION}/gotty_linux_amd64.tar.gz /tmp/gotty.tar.gz
RUN tar -xzf /tmp/gotty.tar.gz -C /tmp \
 && mv /tmp/gotty /usr/local/bin/ \
 && rm /tmp/gotty.tar.gz

WORKDIR /home/octave
COPY Longitud_Tuberia.m .

EXPOSE 8080
CMD ["gotty", "--permit-write", "--port", "8080", \
      "bash", "-lc", "octave --persist Longitud_Tuberia.m 2>/dev/null"]
