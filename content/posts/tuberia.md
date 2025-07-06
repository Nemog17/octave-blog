---
title: "Cálculo de la Longitud de una Tubería con MATLAB y ASCII Gráficos"
# authorAvatarPath: "/avatar.jpeg"
date: "2025-06-17"
summary: "Cálculo de la Longitud de una Tubería con MATLAB y ASCII Gráficos"
description: "Cálculo de la Longitud de una Tubería con MATLAB y ASCII Gráficos"
toc: true
readTime: true
autonumber: true
math: true
tags: ["MATLAB", "gnuplot", "Cálculo", "Longitud de arco", "ASCII Art"]
showTags: false
hideBackToTop: false
fediverse: "@username@instance.url"
exercise: Longitud_Tuberias.m
---

¿Alguna vez te has preguntado cómo calcular la longitud de una tubería curva a partir de su función matemática? En este post exploraremos cómo hacerlo con MATLAB, utilizando gráficos en ASCII con `gnuplot` para una visualización directa desde la terminal.

## 🧮 Fundamento Matemático

La **longitud de arco** de una curva \( y = f(x) \) entre los puntos \( x = a \) y \( x = b \) se calcula con la siguiente fórmula:

$$
L = \int_a^b \sqrt{1 + \left(\frac{dy}{dx}\right)^2} \, dx
$$

Para este ejercicio, la curva es:

$$
y(x) = 0.5x^2 \quad \text{con} \quad \frac{dy}{dx} = x
$$

---

## 🧑‍💻 Código en MATLAB

```matlab
graphics_toolkit('gnuplot');
setenv('GNUTERM','dumb');

y      = @(x) 0.5*x.^2;
dy_dx  = @(x) x;

a = input('Ingrese el límite inferior (a): ');
b = input('Ingrese el límite superior (b): ');
if a >= b, error('a debe ser < b'); end

integrand   = @(x) sqrt(1 + (dy_dx(x)).^2);
arc_length = integral(integrand, a, b);

xv = linspace(a,b,98);
yv = y(xv);

tmp = [tempname() '.dat'];
dlmwrite(tmp, [xv' yv'], ' ');

cmd = sprintf([
    'gnuplot -e "set terminal dumb size 98,28; ', ...
    'set title \\"y(x)=0.5x^2\\"; ', ...
    'plot ''%s'' using 1:2 with lines"'], tmp);

fprintf('\nGráfica ASCII:\n');
system(cmd);
delete(tmp);

fprintf('\nLongitud de arco en [%0.2f,%0.2f] ≈ %0.4f\n', a, b, arc_length);