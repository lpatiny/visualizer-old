<?php


if(strpos($_GET['url'], '/cheminfo/') > -1) {
		echo "##TITLE= C2H6O - resolution: 0.0010\r\n##JCAMP-DX= 5.00\r\n##DATA TYPE= MASS SPECTRUM\r\n##DATA CLASS= PEAK TABLE\r\n##ORIGIN= Generated spectrum based on ChemCalc www.chemcalc.org\r\n##SPECTROMETER/DATA SYSTEM= Based on ChemCalc isotopic distribution calculator\r\n##XUNITS= M/Z\r\n##YUNITS= RELATIVE ABUNDANCE\r\n##NPOINTS= 10\r\n##MAXY= 100\r\n##MINY= 0\r\n##$Monoisotopic mass=46.041865\r\n##$Resolution=0.0010\r\n##$Molecular weight=46.06904\r\n##$Unsaturation=0.0\r\n##PEAK TABLE= (XY..XY)\r\n44.042, 0\r\n46.042, 100\r\n47.045, 2.2244691608\r\n47.046, 0.040096231\r\n47.048, 0.090013502\r\n48.046, 0.2004811548\r\n48.049, 0.0123706576\r\n48.051, 0.0020023226\r\n49.049, 0.0044596415\r\n51.049, 0\r\n##END=\r\n";
} else

echo file_get_contents($_GET['url']);

?>