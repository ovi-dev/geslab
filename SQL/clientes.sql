-- --------------------------------------------------------
-- Host:                         172.16.148.1
-- Versión del servidor:         5.7.39 - MySQL Community Server (GPL)
-- SO del servidor:              osx10.12
-- HeidiSQL Versión:             12.8.0.6908
-- --------------------------------------------------------

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET NAMES utf8 */;
/*!50503 SET NAMES utf8mb4 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

-- Volcando estructura para tabla geslab_canagrosa.clientes
CREATE TABLE IF NOT EXISTS `clientes` (
  `ID_CLIENTE` int(11) NOT NULL AUTO_INCREMENT,
  `NOMBRE` varchar(100) DEFAULT '',
  `DIRECCION` varchar(150) DEFAULT '',
  `COD_POSTAL` int(11) DEFAULT '0',
  `CIF` varchar(100) DEFAULT '',
  `TELEFONO` varchar(25) DEFAULT '',
  `FAX` varchar(25) DEFAULT '',
  `RESPONSABLE` varchar(100) DEFAULT '',
  `RESPONSABLE_OTROS` varchar(100) DEFAULT '',
  `RESPONSABLE_METROLOGIA` varchar(100) DEFAULT '',
  `CARGO` varchar(50) DEFAULT '',
  `TIPO` varchar(100) DEFAULT '',
  `EMAIL` varchar(400) DEFAULT '',
  `EMAIL2` varchar(400) DEFAULT '',
  `EMAIL_FACTURACION` varchar(400) DEFAULT '',
  `EMAIL_METROLOGIA` varchar(400) DEFAULT '',
  `EMAIL_ALODINE` varchar(400) DEFAULT '',
  `BANCO` varchar(100) DEFAULT '',
  `CUENTA` varchar(30) DEFAULT '',
  `OBSERVACIONES` varchar(2048) DEFAULT NULL,
  `WEB` varchar(100) DEFAULT '',
  `PAIS_ID` int(11) DEFAULT '0',
  `PROVINCIA_ID` int(11) DEFAULT '0',
  `MUNICIPIO_ID` int(11) DEFAULT '0',
  `ANULADO` int(11) DEFAULT '0',
  `CENTRO` varchar(100) DEFAULT '',
  `FACTURA_DETERMINACIONES` int(11) NOT NULL DEFAULT '0',
  `EADS` int(11) NOT NULL DEFAULT '0',
  `AIRBUS` int(11) NOT NULL DEFAULT '0',
  `IBERIA` int(11) NOT NULL DEFAULT '0',
  `AGROALIMENTARIO` int(11) NOT NULL DEFAULT '0',
  `EXTRANJERO` int(11) NOT NULL DEFAULT '0',
  `INTRA` int(11) NOT NULL DEFAULT '0',
  `IDIOMA_FACTURA` int(11) NOT NULL DEFAULT '0',
  `FP_ID` int(11) NOT NULL DEFAULT '0',
  `TARIFA_ID` int(11) DEFAULT '0',
  `CLAVEWEB` int(11) NOT NULL DEFAULT '0',
  `CC` varchar(100) DEFAULT '0',
  `ENVIO_DIRECCION` varchar(150) DEFAULT '',
  `ENVIO_COD_POSTAL` int(11) DEFAULT '0',
  `ENVIO_PAIS_ID` int(11) DEFAULT '0',
  `ENVIO_PROVINCIA_ID` int(11) DEFAULT '0',
  `ENVIO_MUNICIPIO_ID` int(11) DEFAULT '0',
  `INFORMES_DIRECCION` varchar(150) DEFAULT '',
  `INFORMES_COD_POSTAL` int(11) DEFAULT '0',
  `INFORMES_PAIS_ID` int(11) DEFAULT '0',
  `INFORMES_PROVINCIA_ID` int(11) DEFAULT '0',
  `INFORMES_MUNICIPIO_ID` int(11) DEFAULT '0',
  `SECCION` varchar(100) DEFAULT '',
  `FACTURA_ELECTRONICA` int(11) DEFAULT '1',
  `PLANT_ID` int(11) DEFAULT '0',
  `PARENT_ID` int(11) DEFAULT '0',
  `CALIBRY_ID` int(11) DEFAULT '0',
  PRIMARY KEY (`ID_CLIENTE`),
  KEY `PAIS_ID` (`PAIS_ID`),
  KEY `PROVINCIA_ID` (`PROVINCIA_ID`),
  KEY `MUNICIPIO_ID` (`MUNICIPIO_ID`)
) ENGINE=MyISAM AUTO_INCREMENT=4383 DEFAULT CHARSET=latin1;

-- La exportación de datos fue deseleccionada.

-- Volcando estructura para tabla geslab_canagrosa.clientes_responsables
CREATE TABLE IF NOT EXISTS `clientes_responsables` (
  `CLIENTE_ID` int(11) NOT NULL DEFAULT '0',
  `RESPONSABLE_ID` int(11) NOT NULL DEFAULT '0',
  PRIMARY KEY (`CLIENTE_ID`,`RESPONSABLE_ID`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

-- La exportación de datos fue deseleccionada.

-- Volcando estructura para tabla geslab_canagrosa.formas_pago
CREATE TABLE IF NOT EXISTS `formas_pago` (
  `ID_FP` int(11) NOT NULL DEFAULT '0',
  `NOMBRE` varchar(100) NOT NULL DEFAULT '',
  `DIAS` int(11) NOT NULL DEFAULT '0',
  `CCC` varchar(50) NOT NULL DEFAULT '',
  PRIMARY KEY (`ID_FP`)
) ENGINE=MyISAM DEFAULT CHARSET=latin1;

-- La exportación de datos fue deseleccionada.

-- Volcando estructura para tabla geslab_canagrosa.municipios
CREATE TABLE IF NOT EXISTS `municipios` (
  `ID_MUNICIPIO` int(11) NOT NULL DEFAULT '0',
  `PROVINCIA_ID` int(11) NOT NULL DEFAULT '0',
  `NOMBRE` varchar(50) DEFAULT '',
  PRIMARY KEY (`ID_MUNICIPIO`),
  KEY `PROVINCIA_ID` (`PROVINCIA_ID`)
) ENGINE=MyISAM DEFAULT CHARSET=latin1;

-- La exportación de datos fue deseleccionada.

-- Volcando estructura para tabla geslab_canagrosa.paises
CREATE TABLE IF NOT EXISTS `paises` (
  `ID_PAIS` int(11) NOT NULL DEFAULT '0',
  `NOMBRE` varchar(100) DEFAULT '',
  PRIMARY KEY (`ID_PAIS`)
) ENGINE=MyISAM DEFAULT CHARSET=latin1;

-- La exportación de datos fue deseleccionada.

-- Volcando estructura para tabla geslab_canagrosa.provincias
CREATE TABLE IF NOT EXISTS `provincias` (
  `ID_PROVINCIA` int(11) NOT NULL DEFAULT '0',
  `PAIS_ID` int(11) DEFAULT '0',
  `NOMBRE` varchar(50) DEFAULT '',
  PRIMARY KEY (`ID_PROVINCIA`),
  KEY `PAIS_ID` (`PAIS_ID`)
) ENGINE=MyISAM DEFAULT CHARSET=latin1;

-- La exportación de datos fue deseleccionada.

-- Volcando estructura para tabla geslab_canagrosa.tarifas
CREATE TABLE IF NOT EXISTS `tarifas` (
  `ID_TARIFA` int(11) NOT NULL DEFAULT '0',
  `NOMBRE` varchar(100) NOT NULL DEFAULT '',
  `TARIFA_ORIGEN_ID` int(11) DEFAULT '0',
  `EN_VIGOR` int(11) DEFAULT '0',
  `PORCENTAJE` varchar(10) NOT NULL DEFAULT '',
  PRIMARY KEY (`ID_TARIFA`)
) ENGINE=MyISAM DEFAULT CHARSET=latin1;

-- La exportación de datos fue deseleccionada.

/*!40103 SET TIME_ZONE=IFNULL(@OLD_TIME_ZONE, 'system') */;
/*!40101 SET SQL_MODE=IFNULL(@OLD_SQL_MODE, '') */;
/*!40014 SET FOREIGN_KEY_CHECKS=IFNULL(@OLD_FOREIGN_KEY_CHECKS, 1) */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40111 SET SQL_NOTES=IFNULL(@OLD_SQL_NOTES, 1) */;
