# Golem Fully Homomorphic Encryption

The goal of this repository is to show how to use homomorphic framework on top of Golem.

There are several frameworks available for homomorphic encryption, here we use OpenFHE.  
This repo offers a simple homomorphic application, the addition of two integers, i.e.:

	Enc(x) + Enc(y) = Enc(x+y)

A homomorphic application must be built for this purpose, which is why it is necessary to code it using a dedicated library.

As we are going to use this application on top of Golem, that is to say in a client/server mode, we need to decompose our application into 3 binaries.
The sources of these binaries are in the my_fhe_add folder.

	1 - generation of private/public keys and encryption of operands (my_fhe_computation_generate_keys_and_encrypt_datas.cpp)
	2 - calculation on encrypted operands (my_fhe_computation_compute.cpp)
	3 - deciphering the result (my_fhe_computation_decrypt_result.cpp)

For ease of use, we use a docker image here for the build and execution of binaries 1 & 3.

The project structure allows you to develop your own homomorphic application.  
Duplicate and rename the my_fhe_add folder, code your application in the existing source files and pass your application as a parameter to your requestor.

This application is only for Linux requestor.

**Requirements**
>  
>Yagna requestor
>  
>System packages:  
>- docker  
>- nodejs  
>  
>Node packages:  
>- @golem-sdk/golem-js  
>- commander  
  
**How to use**  
>Install node packages and clone the repository:  
>```
>sudo npm install -g @golem-sdk/golem-js commander
>git clone https://github.com/norbibi/golem_fully_homomorphic_encryption.git  
>cd golem_fully_homomorphic_encryption  
>```
>Build your application:  
>```
>docker run -ti --rm -v $PWD/my_fhe_add:/usr/src maugnorbert/openfhe  
>```
>Run your Golem application:
>```
>node fully_homomorphic_encryption.mjs --providerid 0x50a6612d55f95ea34f3f82b189ee33dba34c44c4 --computation my_fhe_add --operand1 15 --operand2 8
>```
