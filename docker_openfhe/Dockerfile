FROM ubuntu:22.04

RUN apt-get update && DEBIAN_FRONTEND=noninteractive apt-get install -y \
	build-essential \
	cmake \
	git \
	&& rm -rf /var/lib/apt/lists/*

RUN git clone https://github.com/openfheorg/openfhe-development.git /usr/src/openfhe-development

WORKDIR /usr/src

RUN cd openfhe-development	\
	&& mkdir build		\
	&& cd build		\
	&& cmake ..		\
	&& make -j		\
	&& make install

RUN ldconfig

COPY build.sh /root/build.sh
RUN chmod +x /root/build.sh

ENTRYPOINT ["/root/build.sh"]
CMD ["-b"]
