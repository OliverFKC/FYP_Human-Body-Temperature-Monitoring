x = [32.07 32.75 33.05 33.21 33.57 33.97 34.57 35.53 36.41 37.53];  % Temperature measured by MLX90614
y = [31.50 32.30 32.60 32.70 33.00 33.50 34.00 35.00 36.00 37.00];  % Temperature measured by AR842A
diff = y-x;             % Difference between the temperatures measured by MLX90614 and AR842A
offset = mean(diff); % Offset is defined as the mean difference
x2 = x + offset;       % Calibrated MLX90614 values

P = polyfit(x2,y,2)  % Polynomials definition
Y = polyval(P,x2);   % Fitted curve

figure(1)
plot(x2, Y-x2)
title('errors for poly 2')
xlabel('Calibrated MLX90614 Values')
ylabel('Errors')