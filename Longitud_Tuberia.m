%% Longitud_Tuberia.m - ASCII con gnuplot
graphics_toolkit('gnuplot');
setenv('GNUTERM','dumb');

y      = @(x) 0.5*x.^2;
dy_dx  = @(x) x;

a = input('Ingrese el límite inferior (a): ');
b = input('Ingrese el límite superior (b): ');
if a >= b, error('a debe ser < b'); end

integrand   = @(x) sqrt(1 + (dy_dx(x)).^2);
arc_length = integral(integrand, a, b);

xv = linspace(a,b,80);
yv = y(xv);

tmp = [tempname() '.dat'];
dlmwrite(tmp, [xv' yv'], ' ');

cmd = sprintf([
    'gnuplot -e "set terminal dumb size 80,20; ', ...
    'set title \\"y(x)=0.5x^2\\"; ', ...
    'plot ''%s'' using 1:2 with lines"'], tmp);

fprintf('\nGráfica ASCII:\n');
system(cmd);
delete(tmp);

fprintf('\nLongitud de arco en [%0.2f,%0.2f] ≈ %0.4f\n', a, b, arc_length);